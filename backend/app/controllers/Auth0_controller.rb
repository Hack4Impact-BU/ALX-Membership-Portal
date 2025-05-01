require 'http'
require 'dotenv'
require 'json'
require 'net/http'
Dotenv.load

class Auth0Controller < ApplicationController

  skip_before_action :authenticate_request, only: [:login, :sign_up, :token]
  
  def sign_up
    email = params[:email]
    password = params[:password]
    name = params[:name]
    phone_number = params[:phone_number]
    terms_accepted = params[:terms_accepted]

    Rails.logger.info("Sign-up request received with email: #{email}, name: #{name}, phone_number: #{phone_number}")
   
    if !terms_accepted
      return render json: { error: 'Terms and conditions must be accepted' }, status: :unprocessable_entity
    end

    # Check if email ends with amplifylatinx.com
    is_admin = email.end_with?('@amplifylatinx.com')
    
    response = HTTP.post("https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/dbconnections/signup", json: {
      client_id: ENV['AUTH0_CLIENT_ID'],
      email: email,
      password: password,
      connection: 'Username-Password-Authentication',
      user_metadata: {
        name: name,
        phone_number: phone_number,
        terms_accepted: terms_accepted.to_s,
        terms_accepted_at: Time.current.to_s
      }
    })

    Rails.logger.info("Auth0 response: #{response.body}")

    if response.status.success?
      user_data = JSON.parse(response.body)
      
      # If user is admin, assign admin permissions
      if is_admin
        begin
          # Get management API token
          token_response = HTTP.post("https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/oauth/token", json: {
            client_id: ENV['AUTH0_CLIENT_ID'],
            client_secret: ENV['AUTH0_SECRET_ID'],
            audience: "https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/api/v2/",
            grant_type: "client_credentials"
          })

          if token_response.status.success?
            management_token = JSON.parse(token_response.body)['access_token']
            
            # First, get the role ID for the admin role
            roles_response = HTTP.get(
              "https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/api/v2/roles",
              headers: {
                "Authorization" => "Bearer #{management_token}",
                "Content-Type" => "application/json"
              }
            )

            if roles_response.status.success?
              roles = JSON.parse(roles_response.body)
              admin_role = roles.find { |role| role['name'] == 'Admin' }
              
              if admin_role
                # Get the user ID from the _id field and format it correctly
                user_id = "auth0|#{user_data['_id']}"
                Rails.logger.info("Attempting to assign admin role to user: #{user_id}")
                
                # Assign the admin role to the user
                role_assignment_response = HTTP.post(
                  "https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/api/v2/roles/#{admin_role['id']}/users",
                  json: {
                    users: [user_id]
                  },
                  headers: {
                    "Authorization" => "Bearer #{management_token}",
                    "Content-Type" => "application/json"
                  }
                )

                Rails.logger.info("Role assignment response: #{role_assignment_response.body}")
                if role_assignment_response.status.success?
                  Rails.logger.info("Successfully assigned admin role to user: #{user_id}")
                else
                  Rails.logger.error("Failed to assign admin role. Response: #{role_assignment_response.body}")
                end
              else
                Rails.logger.error("Admin role not found in Auth0")
              end
            else
              Rails.logger.error("Failed to fetch roles. Response: #{roles_response.body}")
            end
          end
        rescue StandardError => e
          Rails.logger.error("Error assigning admin role: #{e.message}")
        end
      end

      render json: { 
        message: 'User signed up successfully', 
        user: user_data,
        is_admin: is_admin
      }, status: :created
    else
      render json: { error: response.parse }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error("Sign-up error: #{e.message}")
    render json: { error: 'Internal Server Error' }, status: :internal_server_error
  end

  def login
    email = params[:email]
    password = params[:password]

    
    response = HTTP.post("https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/oauth/token", json: {
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
      client_id: ENV['AUTH0_CLIENT_ID'],
      client_secret: ENV['AUTH0_SECRET_ID'],
      username: email,
      password: password,
      scope: 'openid profile email',
      realm: 'Username-Password-Authentication',
      audience: ENV['NEXT_PUBLIC_AUTH0_AUDIENCE']
    })

    Rails.logger.info("Auth0 response: #{response.body}")

    if response.status.success?
      token_data = response.parse(:json)
      render json: { message: 'Login successful', tokens: token_data }, status: :ok
    else
      error_description = response.parse(:json)['error_description'] || 'An error occurred during login'
      render json: { error: error_description }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error("Login error: #{e.message}")
    render json: { error: 'Internal Server Error' }, status: :internal_server_error
  end

  def token
    uri = URI("https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/oauth/token")

    response = Net::HTTP.post(
      uri,
      {
        client_id: ENV['AUTH0_CLIENT_ID'],
        client_secret: ENV['AUTH0_SECRET_ID'],
        audience: ENV['AUTH0_AUDIENCE'],
        grant_type: "client_credentials"
      }.to_json,
      "Content-Type" => "application/json"
    )

    Rails.logger.info("Auth0 Token Response: #{response.body}")

    if response.code.to_i == 200
      render json: JSON.parse(response.body), status: :ok
    else
      render json: { error: "Failed to fetch token" }, status: :unprocessable_entity
    end
  end
end
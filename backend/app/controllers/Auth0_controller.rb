require 'http'

class Auth0Controller < ApplicationController

  skip_before_action :authenticate_request, only: [:login, :sign_up]
  
  def sign_up
    email = params[:email]
    password = params[:password]

    # Log the environment variables to debug any issues with them
    Rails.logger.info("Sign up request received with email: #{email}")
    
    response = HTTP.post("https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/dbconnections/signup", json: {
      client_id: ENV['AUTH0_CLIENT_ID'],
      email: email,
      password: password,
      connection: 'Username-Password-Authentication'
    })

    Rails.logger.info("Auth0 response: #{response.body}")

    if response.status.success?
      render json: { message: 'User signed up successfully', user: JSON.parse(response.body) }, status: :created
    else
      render json: { error: response.parse }, status: :unprocessable_entity
    end
  end

  def login
    email = params[:email]
    password = params[:password]

    # Log the environment variables to debug any issues with them

    Rails.logger.info("Login request received with email: #{email}")
    
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
end
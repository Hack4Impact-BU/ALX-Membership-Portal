require 'net/http'
require 'json'
require 'uri'

class UsersController < ApplicationController
  before_action :authenticate_request, only: [:index, :profile]
  def profile
    userinfo_response = HTTP.auth("Bearer #{auth_token}").get("https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/userinfo")

    if userinfo_response.status.success?
      user_info = JSON.parse(userinfo_response.body.to_s)
      render json: { user: user_info }, status: :ok
    else
      render json: { error: 'Failed to fetch user info' }, status: :unprocessable_entity
    end
  end

  def index
    token = request.headers['Authorization']&.split(' ')&.last

    if token.nil?
      return render json: { error: "Missing token" }, status: :unauthorized
    end

    users = fetch_all_users(token)

    if users
      formatted_users = users.map do |user|
        {
          email: user["email"],
          username: user.dig("user_metadata", "name") || "N/A",
          phone_number: user.dig("user_metadata", "phone_number") || "N/A",
          created_at: user["created_at"]
        }
      end

      render json: { users: formatted_users }, status: :ok
    else
      render json: { error: "Failed to fetch users" }, status: :unprocessable_entity
    end
  end

  private
  
  def fetch_all_users(token)
    return unless token

    uri = URI("https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/api/v2/users?per_page=100")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{token}"
    request["Content-Type"] = "application/json"

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    JSON.parse(response.body) if response.code.to_i == 200
  end


  def auth_token
    request.headers['Authorization']&.split(' ')&.last
  end
end

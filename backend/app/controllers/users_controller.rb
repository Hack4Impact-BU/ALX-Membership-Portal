class UsersController < ApplicationController
  def profile
    userinfo_response = HTTP.auth("Bearer #{auth_token}").get("https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/userinfo")

    if userinfo_response.status.success?
      user_info = JSON.parse(userinfo_response.body.to_s)
      render json: { user: user_info }, status: :ok
    else
      render json: { error: 'Failed to fetch user info' }, status: :unprocessable_entity
    end
  end

  private

  def auth_token
    request.headers['Authorization']&.split(' ')&.last
  end
end

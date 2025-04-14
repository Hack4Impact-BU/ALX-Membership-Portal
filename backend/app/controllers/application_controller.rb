require 'http'
require 'json'
require 'openssl'

class ApplicationController < ActionController::API
    before_action :authenticate_request
 
    private
 
    def authenticate_request
      token = request.headers['Authorization']&.split(' ')&.last
 
      if token
        begin
          decoded_token = JWT.decode(token, nil, true, {
            issuer: "https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/",
            algorithms: ['RS256'],
            verify_iss: true,
            verify_aud: true,
            aud:  [ENV['NEXT_PUBLIC_AUTH0_AUDIENCE'], ENV['AUTH0_AUDIENCE']],
          }) do |header|
            jwks_hash[header['kid']]
          end
          user_info = decoded_token[0]
          permissions = user_info['https://membership-portal/permissions']

          @current_user = {
            name: user_info['name'],
            email: user_info['email'],
            sub: user_info['sub'],
            is_admin: permissions&.include?('admin') || false
          }

                # Helper method to check if current user is an admin
          def require_admin
            unless @current_user&.[](:is_admin)
              render json: { error: 'Admin access required' }, status: :forbidden
            end
          end

          # Helper method to get current user
          def current_user
            @current_user
          end
        

        rescue JWT::ExpiredSignature
          Rails.logger.error("JWT Error: Token has expired")
          render json: { error: 'Token has expired' }, status: :unauthorized
        rescue JWT::InvalidIssuerError
          Rails.logger.error("JWT Error: Invalid issuer")
          render json: { error: 'Invalid issuer' }, status: :unauthorized
        rescue JWT::InvalidAudError
          Rails.logger.error("JWT Error: Invalid audience")
          render json: { error: 'Invalid audience' }, status: :unauthorized
        rescue JWT::DecodeError => e
          Rails.logger.error("JWT Decode Error: #{e.message}")
          render json: { error: 'Invalid token' }, status: :unauthorized
        rescue StandardError => e
          Rails.logger.error("Authentication Error: #{e.message}")
          render json: { error: 'Internal Server Error' }, status: :internal_server_error
        end
      else
        Rails.logger.error("Authentication Error: Authorization header missing")
        render json: { error: 'Authorization header missing' }, status: :unauthorized
      end
    end
 
    def jwks_hash
      jwks_raw = HTTP.get("https://#{ENV['NEXT_PUBLIC_AUTH0_DOMAIN']}/.well-known/jwks.json").to_s
      jwks_keys = JSON.parse(jwks_raw)['keys']
      Hash[
        jwks_keys.map do |k|
          cert = OpenSSL::X509::Certificate.new(Base64.decode64(k['x5c'].first))
          [
            k['kid'],
            cert.public_key(
            )
          ]
        end
      ]
    end
  end
class SavedProductOffersController < ApplicationController
  # Ensure authentication for all actions
  before_action :authenticate_request 
  # Find the specific product offer based on the ID in the URL for create/destroy
  before_action :set_product_offer, only: [:create, :destroy]

  # GET /saved_product_offers
  # Returns all product offers saved by the current user
  def index
    user_id = current_user_id
    # Ensure we have a user ID (should be guaranteed by authenticate_request)
    unless user_id
      return render json: { error: 'Not authenticated' }, status: :unauthorized
    end

    Rails.logger.debug "Fetching saved product offers for user: #{user_id}"

    # Get IDs of product offers saved by this user
    saved_offer_ids = SavedProductOffer.where(user_id: user_id).pluck(:product_offer_id)

    # Find the corresponding ProductOffer records
    @saved_offers = ProductOffer.where(id: saved_offer_ids)

    # Add isSaved=true to all of them (as this endpoint returns only saved items)
    @saved_offers_with_status = @saved_offers.map do |offer|
      offer.as_json.merge(isSaved: true)
    end

    render json: @saved_offers_with_status
  end

  # POST /product_offers/:id/save
  # Save a product offer for the current user
  def create
    user_id = current_user_id
    unless user_id
      return render json: { error: 'Not authenticated' }, status: :unauthorized
    end

    # Check if already saved
    existing = SavedProductOffer.find_by(user_id: user_id, product_offer_id: @product_offer.id)
    if existing
      return render json: { status: 'success', saved: true, message: 'Product offer already saved' }
    end

    # Create the saved record
    @saved_offer = SavedProductOffer.new(
      user_id: user_id,
      product_offer_id: @product_offer.id
    )

    if @saved_offer.save
      render json: { status: 'success', saved: true }, status: :created
    else
      render json: { status: 'error', errors: @saved_offer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /product_offers/:id/save
  # Unsave a product offer for the current user
  def destroy
    user_id = current_user_id
    unless user_id
      return render json: { error: 'Not authenticated' }, status: :unauthorized
    end

    # Find the saved record
    @saved_offer = SavedProductOffer.find_by(user_id: user_id, product_offer_id: @product_offer.id)

    if @saved_offer
      @saved_offer.destroy
      render json: { status: 'success', saved: false }
    else
      # If not found, it means it wasn't saved by this user or doesn't exist
      render json: { status: 'error', message: 'Product offer not found or not saved by user' }, status: :not_found
    end
  end

  private

  # Find the ProductOffer based on the :id param from the member route
  def set_product_offer
    @product_offer = ProductOffer.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { status: 'error', message: 'Product Offer not found' }, status: :not_found
  end

  # Helper to get user ID from token - Reuse from ApplicationController or concern if possible
  def current_user_id
    token = request.headers['Authorization']&.split(' ')&.last
    return nil unless token
    begin
      # Consider adding verification here if not done in authenticate_request
      decoded_token = JWT.decode(token, nil, false) 
      user_id = decoded_token[0]['sub']
      return user_id
    rescue JWT::DecodeError, KeyError => e
      Rails.logger.error("Error decoding token or finding sub: #{e.message}")
      return nil
    end
  end
end 
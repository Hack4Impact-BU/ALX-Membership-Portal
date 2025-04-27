class ProductOffersController < ApplicationController
  skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]
  before_action :set_product_offer, only: %i[show update destroy]

  # GET /product_offers
  def index
    @product_offers = ProductOffer.all
    user_id = current_user_id
    saved_offer_ids = []

    if user_id
      Rails.logger.debug "Checking saved status for product offers for user: #{user_id}"
      saved_offer_ids = SavedProductOffer.where(user_id: user_id).pluck(:product_offer_id)
      Rails.logger.debug "User has saved product offer IDs: #{saved_offer_ids}"
    end

    render json: @product_offers.map { |offer|
      is_saved = saved_offer_ids.include?(offer.id)
      pic_url = offer.pic_url
      offer.as_json.merge(isSaved: is_saved, pic_url: pic_url)
    }
  end

  # GET /product_offers/1
  def show
    is_saved = false
    user_id = current_user_id

    if user_id
      Rails.logger.debug "Checking saved status for offer #{@product_offer.id} for user: #{user_id}"
      is_saved = SavedProductOffer.exists?(user_id: user_id, product_offer_id: @product_offer.id)
      Rails.logger.debug "Offer saved status: #{is_saved}"
    end

    pic_url = @product_offer.pic_url
    render json: @product_offer.as_json.merge(isSaved: is_saved, pic_url: pic_url)
  end

  # POST /product_offers
  def create
    permitted_params = product_offer_params.except(:isSaved)
    @product_offer = ProductOffer.new(permitted_params)

    if @product_offer.save
      pic_url = @product_offer.pic_url
      render json: @product_offer.as_json.merge(isSaved: false, pic_url: pic_url), status: :created, location: @product_offer
    else
      render json: { errors: @product_offer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /product_offers/1
  def update
    permitted_params = product_offer_params.except(:isSaved)
    if @product_offer.update(permitted_params)
      is_saved = false
      user_id = current_user_id
      is_saved = SavedProductOffer.exists?(user_id: user_id, product_offer_id: @product_offer.id) if user_id
      
      pic_url = @product_offer.pic_url
      render json: @product_offer.as_json.merge(isSaved: is_saved, pic_url: pic_url)
    else
      render json: { errors: @product_offer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /product_offers/1
  def destroy
    @product_offer.destroy!
    head :no_content
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_product_offer
      @product_offer = ProductOffer.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Product Offer not found' }, status: :not_found
    end

    # Only allow a list of trusted parameters through.
    def product_offer_params
      params.require(:product_offer).permit(
        :place, 
        :offerTitle, 
        :offerDesc, 
        :instruct, 
        :isSaved, 
        :startDate, 
        :endDate, 
        :businessType, 
        :pic_url
      )
    end

    # Helper to get user ID from token - Reuse from ApplicationController or concern if possible
    def current_user_id
      token = request.headers['Authorization']&.split(' ')&.last
      return nil unless token
      begin
        decoded_token = JWT.decode(token, nil, false)
        user_id = decoded_token[0]['sub']
        return user_id
      rescue JWT::DecodeError, KeyError => e
        Rails.logger.error("Error decoding token or finding sub: #{e.message}")
        return nil
      end
    end
end

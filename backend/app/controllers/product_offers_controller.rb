class ProductOffersController < ApplicationController
  skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]
  before_action :set_product_offer, only: %i[show update destroy]

  # GET /product_offers
  def index
    @product_offers = ProductOffer.all
    
    result = @product_offers.map do |offer|
      {
        id: offer.id,
        businessType: offer.businessType,
        endDate: offer.endDate,
        instruct: offer.instruct,
        offerDesc: offer.offerDesc,
        offerTitle: offer.offerTitle,
        place: offer.place,
        startDate: offer.startDate,
        created_at: offer.created_at,
        updated_at: offer.updated_at,
        isSaved: offer.isSaved,
        pic_url: offer.pic_url
      }
    end
    
    render json: result
  end

  # GET /product_offers/1
  def show
    result = {
      id: @product_offer.id,
      businessType: @product_offer.businessType,
      endDate: @product_offer.endDate,
      instruct: @product_offer.instruct,
      offerDesc: @product_offer.offerDesc,
      offerTitle: @product_offer.offerTitle,
      place: @product_offer.place,
      startDate: @product_offer.startDate,
      created_at: @product_offer.created_at,
      updated_at: @product_offer.updated_at,
      isSaved: @product_offer.isSaved,
      pic_url: @product_offer.pic_url
    }
    
    render json: result
  end

  # POST /product_offers
  def create
    @product_offer = ProductOffer.new(product_offer_params)

    if @product_offer.save
      result = {
        id: @product_offer.id,
        businessType: @product_offer.businessType,
        endDate: @product_offer.endDate,
        instruct: @product_offer.instruct,
        offerDesc: @product_offer.offerDesc,
        offerTitle: @product_offer.offerTitle,
        place: @product_offer.place,
        startDate: @product_offer.startDate,
        created_at: @product_offer.created_at,
        updated_at: @product_offer.updated_at,
        isSaved: @product_offer.isSaved,
        pic_url: @product_offer.pic_url
      }
      
      render json: result, status: :created, location: @product_offer
    else
      render json: @product_offer.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /product_offers/1
  def update
    if @product_offer.update(product_offer_params)
      result = {
        id: @product_offer.id,
        businessType: @product_offer.businessType,
        endDate: @product_offer.endDate,
        instruct: @product_offer.instruct,
        offerDesc: @product_offer.offerDesc,
        offerTitle: @product_offer.offerTitle,
        place: @product_offer.place,
        startDate: @product_offer.startDate,
        created_at: @product_offer.created_at,
        updated_at: @product_offer.updated_at,
        isSaved: @product_offer.isSaved,
        pic_url: @product_offer.pic_url
      }
      
      render json: result
    else
      render json: @product_offer.errors, status: :unprocessable_entity
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
    end

    # Only allow a list of trusted parameters through.
    def product_offer_params
      params.require(:product_offer).permit(:businessType, :endDate, :instruct, :offerDesc, :offerTitle, :place, :startDate, :pic_url, :isSaved)
    end
end

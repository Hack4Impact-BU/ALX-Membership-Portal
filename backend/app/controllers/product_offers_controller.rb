class ProductOffersController < ApplicationController
  skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]
  before_action :set_product_offer, only: %i[show update destroy]

  
  def index
    @product_offer = ProductOffer.all

    render json: @product_offer
  end

  def show
    render json: @product_offer
  end

  def create
    @product_offer = ProductOffer.new(product_offer_params)

    if @product_offer.save
      render json: @product_offer, status: :created, location: @product_offer
    else
      render json: @product_offer.errors, status: :unprocessable_entity
    end
  end

  def update
    if @product_offer.update(product_offer_params)
      render json: @product_offer
    else
      render json: @product_offer.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @product_offer.destroy!
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_eventlist
      @product_offer = ProductOffer.find(params[:id])
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
        :pic
      )
    end
end

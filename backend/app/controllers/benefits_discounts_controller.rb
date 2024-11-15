class BenefitsDiscountsController < ApplicationController
    skip_before_action :authenticate_request, only: [:create, :index, :show]
    before_action :set_benefits_discount, only: %i[show update destroy]
  
    # GET /benefits_discounts
    def index
      @benefits_discounts = BenefitsDiscount.all
      render json: @benefits_discounts
    end
  
    # GET /benefits_discounts/1
    def show
      render json: @benefits_discount
    end
  
    # POST /benefits_discounts
    def create
      @benefits_discount = BenefitsDiscount.new(benefits_discount_params)
  
      if @benefits_discount.save
        render json: @benefits_discount, status: :created, location: @benefits_discount
      else
        render json: @benefits_discount.errors, status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /benefits_discounts/1
    def update
      if @benefits_discount.update(benefits_discount_params)
        render json: @benefits_discount
      else
        render json: @benefits_discount.errors, status: :unprocessable_entity
      end
    end
  
    # DELETE /benefits_discounts/1
    def destroy
      @benefits_discount.destroy!
      head :no_content
    end
  
    private
  
      # Use callbacks to share common setup or constraints between actions.
      def set_benefits_discount
        @benefits_discount = BenefitsDiscount.find(params[:id])
      end
  
      # Only allow a list of trusted parameters through.
      def benefits_discount_params
        params.require(:benefits_discount).permit(:title, :location, :start_date, :end_date, :offer_description)
      end
  end
  
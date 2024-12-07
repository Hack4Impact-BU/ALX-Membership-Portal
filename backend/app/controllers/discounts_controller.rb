class DiscountsController < ApplicationController
    skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]
    before_action :set_discount, only: %i[show update destroy]
  
    # GET /discounts
    def index
      @discounts = Discount.all
  
      render json: @discounts
    end
  
    # GET /discounts/:id
    def show
      render json: @discount
    end
  
    # POST /discounts
    def create
      @discount = Discount.new(discount_params)
  
      if @discount.save
        render json: @discount, status: :created, location: @discount
      else
        render json: @discount.errors, status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /discounts/:id
    def update
      if @discount.update(discount_params)
        render json: @discount
      else
        render json: @discount.errors, status: :unprocessable_entity
      end
    end
  
    # DELETE /discounts/:id
    def destroy
      @discount.destroy!
    end
  
    private
  
      # Use callbacks to share common setup or constraints between actions.
      def set_discount
        @discount = Discount.find(params[:id])
      end
  
      # Only allow a list of trusted parameters through.
      def discount_params
        params.require(:discount).permit(:title, :location, :start_date, :end_date, :offer_description, :redeem_desc, :is_saved, :date)
      end
  end
  
class QAndAsController < ApplicationController
    skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy]
    before_action :set_q_and_a, only: [:show, :update, :destroy]
  
    # GET /q_and_as
    def index
      @q_and_as = QAndA.all
      render json: @q_and_as
    end
  
    # GET /q_and_as/:id
    def show
      render json: @q_and_a
    end    
  
    # GET /q_and_as/new
    def new
      @q_and_a = QAndA.new
    end
  
    # POST /q_and_as
    def create
      @q_and_a = QAndA.new(q_and_a_params)
      if @q_and_a.save
        render json: @q_and_a, status: :created
      else
        render json: { error: "Failed to create Q&A pair.", details: @q_and_a.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    # DELETE /q_and_as/:id
    def destroy
      if @q_and_a.destroy
        render json: { message: "Q&A pair deleted successfully!" }, status: :ok
      else
        render json: { error: "Failed to delete Q&A pair." }, status: :unprocessable_entity
      end
    end
  
    private
  
    # Fetch QAndA object for `show`, `update`, and `destroy`
    def set_q_and_a
      @q_and_a = QAndA.find_by(id: params[:id])
      unless @q_and_a
        render json: { error: "Q&A pair not found" }, status: :not_found
      end
    end
  
    # Strong parameters
    def q_and_a_params
      params.require(:q_and_a).permit(:question, :answer)
    end
  end
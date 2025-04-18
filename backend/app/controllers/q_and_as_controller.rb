class QAndAsController < ApplicationController
    skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]
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
        render json: @q_and_a, status: :created, location: @q_and_a
      else
        render json: @q_and_a.errors, status: :unprocessable_entity
      end
    end
  
    # PUT /q_and_as/:id
    def update
      if @q_and_a.update(q_and_a_params)
        render json: @q_and_a
      else
        render json: @q_and_a.errors, status: :unprocessable_entity 
      end
    end
  
    # DELETE /q_and_as/:id
    def destroy
      @q_and_a.destroy
      head :no_content
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
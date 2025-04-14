class TrainingController < ApplicationController
    skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]
    before_action :set_training, only: %i[show update destroy]
  
    # GET /trainings
    def index
      @trainings = Training.all
      render json: @trainings
    end
  
    # GET /trainings/:id
    def show
      render json: @training
    end
  
    # POST /trainings
    def create
      @training = Training.new(training_params)
  
      if @training.save
        render json: @training, status: :created, location: @training
      else
        render json: @training.errors, status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /trainings/:id
    def update
      if @training.update(training_params)
        render json: @training
      else
        render json: @training.errors, status: :unprocessable_entity
      end
    end
  
    # DELETE /trainings/:id
    def destroy
      @training.destroy!
      head :no_content
    end
  
    private
  
      # Use callbacks to share common setup or constraints between actions.
      def set_training
        @training = Training.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Training not found" }, status: :not_found
      end
  
      # Only allow a list of trusted parameters through.
      def training_params
        params.require(:training).permit(
          :trainingTitle, 
          :trainingDesc, 
          :link, 
          :date, 
        )
      end
  end
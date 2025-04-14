class ResearchController < ApplicationController
    skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]
    before_action :set_research, only: %i[show update destroy]
  
    # GET /research
    def index
      @research = Research.all
      render json: @research
    end
  
    # GET /research/:id
    def show
      render json: @research
    end
  
    # POST /research
    def create
      @research = Research.new(research_params)
  
      if @research.save
        render json: @research, status: :created, location: @research
      else
        render json: @research.errors, status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /research/:id
    def update
      if @research.update(research_params)
        render json: @research
      else
        render json: @research.errors, status: :unprocessable_entity
      end
    end
  
    # DELETE /research/:id
    def destroy
      @research.destroy!
    end
  
    private
  
      # Use callbacks to share common setup or constraints between actions.
      def set_research
        @research = Research.find(params[:id])
      end
  
      # Only allow a list of trusted parameters through.
      def research_params
        params.require(:research).permit(
          :researchTitle, 
          :researchDesc, 
          :link, 
          :date, 
          :location
        )
      end
  end
class GetInvolvedsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy] 
  before_action :set_get_involved, only: %i[ show update destroy ]

  # GET /get_involveds
  def index
    @get_involved = GetInvolved.all

    render json: @get_involved
  end

  # GET /get_involveds/1
  def show
    render json: @get_involved
  end

  # POST /get_involveds
  def create
    @get_involved = GetInvolved.new(get_involved_params)

    if @get_involved.save
      render json: @get_involved, status: :created, location: @get_involved
    else
      render json: @get_involved.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /get_involveds/1
  def update
    if @get_involved.update(get_involved_params)
      render json: @get_involved
    else
      render json: @get_involved.errors, status: :unprocessable_entity
    end
  end

  # DELETE /get_involveds/1
  def destroy
    @get_involved.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_get_involved
      @get_involved = GetInvolved.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def get_involved_params
      params.require(:get_involved).permit(:title, :summary, :description, :date, :time, :location, :phone)
    end
end

class EventlistsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]
  before_action :set_eventlist, only: %i[show update destroy]

  # GET /eventlists
  def index
    @events = Eventlist.all
    render json: @events.map { |event| 
      event.as_json.merge(image_url: event.image.attached? ? url_for(event.image) : nil) 
    }
  end

  # GET /eventlists/1
  def show
    render json: @eventlist.as_json.merge(
      image_url: @eventlist.image.attached? ? url_for(@eventlist.image) : nil
    )
  end

  # POST /eventlists
  def create
    @eventlist = Eventlist.new(event_params)

    if @eventlist.save
      render json: @eventlist, status: :created, location: @eventlist
    else
      render json: @eventlist.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /eventlists/1
  def update
    if @eventlist.update(event_params)
      render json: @eventlist
    else
      render json: @eventlist.errors, status: :unprocessable_entity
    end
  end

  # DELETE /eventlists/1
  def destroy
    @eventlist.destroy!
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_eventlist
      @eventlist = Eventlist.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def event_params
      params.require(:eventlist).permit(
        :eventType, 
        :startDate, 
        :endDate, 
        :location, 
        :org, 
        :timeStart, 
        :timeEnd, 
        :eventName, 
        :isSaved, 
        :eventDesc, 
        :instruct, 
        :pic, 
        :phone, 
        :lat, 
        :lng, 
        :image
      )
    end
end

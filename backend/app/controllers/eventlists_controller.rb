class EventlistsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]
  before_action :set_eventlist, only: %i[show update destroy]

  # GET /eventlists
  def index
    @events = Eventlist.all
    user_id = current_user_id # Get current user ID if authenticated
    saved_event_ids = []

    if user_id
      Rails.logger.debug "Checking saved status for eventlists for user: #{user_id}"
      saved_event_ids = SavedEvent.where(user_id: user_id).pluck(:eventlist_id)
      Rails.logger.debug "User has saved event IDs: #{saved_event_ids}"
    end

    # Map events with saved status and image URL
    render json: @events.map { |event|
      is_saved = saved_event_ids.include?(event.id)
      image_url = event.image.attached? ? url_for(event.image) : nil
      # Use isSaved consistent with your model/frontend expectations
      event.as_json.merge(isSaved: is_saved, image_url: image_url)
    }
  end

  # GET /eventlists/1
  def show
    is_saved = false
    user_id = current_user_id # Get current user ID if authenticated

    if user_id
      Rails.logger.debug "Checking saved status for eventlist #{@eventlist.id} for user: #{user_id}"
      is_saved = SavedEvent.exists?(user_id: user_id, eventlist_id: @eventlist.id)
      Rails.logger.debug "Event saved status: #{is_saved}"
    end

    image_url = @eventlist.image.attached? ? url_for(@eventlist.image) : nil
    # Use isSaved consistent with your model/frontend expectations
    render json: @eventlist.as_json.merge(isSaved: is_saved, image_url: image_url)
  end

  # POST /eventlists
  def create
    # Note: The isSaved field from params is ignored here.
    # Saved status should be determined by the SavedEvent table, not directly set.
    permitted_params = event_params.except(:isSaved)
    @eventlist = Eventlist.new(permitted_params)

    if @eventlist.save
      image_url = @eventlist.image.attached? ? url_for(@eventlist.image) : nil
      render json: @eventlist.as_json.merge(isSaved: false, image_url: image_url), status: :created, location: @eventlist
    else
      render json: { errors: @eventlist.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /eventlists/1
  def update
    # Note: The isSaved field from params is ignored here.
    permitted_params = event_params.except(:isSaved)
    if @eventlist.update(permitted_params)
      is_saved = false
      user_id = current_user_id
      is_saved = SavedEvent.exists?(user_id: user_id, eventlist_id: @eventlist.id) if user_id

      image_url = @eventlist.image.attached? ? url_for(@eventlist.image) : nil
      render json: @eventlist.as_json.merge(isSaved: is_saved, image_url: image_url)
    else
      render json: { errors: @eventlist.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /eventlists/1
  def destroy
    # Associated saved_events will be destroyed automatically due to `dependent: :destroy`
    @eventlist.destroy!
    head :no_content # Return 204 No Content on successful deletion
  end

  private

  def set_eventlist
    @eventlist = Eventlist.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Eventlist not found' }, status: :not_found
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
      :isSaved, # Keep allowing it for now, but we ignore it in create/update
      :eventDesc,
      :instruct,
      :pic,
      :phone,
      :lat,
      :lng,
      :image
    )
  end

  # Helper method to get current user ID (copied from SavedEventsController)
  # Consider moving this to ApplicationController
  def current_user_id
    token = request.headers['Authorization']&.split(' ')&.last
    return nil unless token
    begin
      decoded_token = JWT.decode(token, nil, false) # Decode without verification for user ID
      user_id = decoded_token[0]['sub']
      return user_id
    rescue JWT::DecodeError, KeyError => e
      Rails.logger.error("Error decoding token or finding sub: #{e.message}")
      return nil
    end
  end
end

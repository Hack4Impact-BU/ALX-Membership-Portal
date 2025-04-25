class SavedEventsController < ApplicationController
  before_action :authenticate_request
  before_action :set_eventlist, only: [:create, :destroy]
  # Decide if authentication is needed for index based on your app logic
  # skip_before_action :authenticate_request, only: [:index] 

  # GET /saved_events
  # Returns all events saved by the current user
  def index
    user_id = current_user_id
    if user_id.nil?
      return render json: { error: 'Not authenticated' }, status: :unauthorized
    end

    Rails.logger.debug "Fetching saved events for user: #{user_id}"

    # Get all eventlist IDs saved by this user
    saved_event_ids = SavedEvent.where(user_id: user_id).pluck(:eventlist_id)

    # Find all those events
    @saved_events = Eventlist.where(id: saved_event_ids)

    # Add is_saved=true to all of them
    @saved_events_with_status = @saved_events.map do |event|
      event.as_json.merge(isSaved: true) # Use isSaved to match Eventlist schema
    end

    render json: @saved_events_with_status
  end

  # POST /eventlists/:eventlist_id/save
  # Save an event for the current user
  def create
    user_id = current_user_id
    if user_id.nil?
      return render json: { error: 'Not authenticated' }, status: :unauthorized
    end

    existing = SavedEvent.find_by(user_id: user_id, eventlist_id: @eventlist.id)

    if existing
      return render json: { status: 'success', saved: true, message: 'Event already saved' }
    end

    @saved_event = SavedEvent.new(
      user_id: user_id,
      eventlist_id: @eventlist.id
    )

    if @saved_event.save
      # Optionally update the event itself if it has an isSaved field (check schema)
      # @eventlist.update(isSaved: true) # <-- Be careful with this, might not be desired logic
      render json: { status: 'success', saved: true }, status: :created
    else
      render json: { status: 'error', errors: @saved_event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /eventlists/:eventlist_id/save
  # Unsave an event for the current user
  def destroy
    user_id = current_user_id
    if user_id.nil?
      return render json: { error: 'Not authenticated' }, status: :unauthorized
    end

    @saved_event = SavedEvent.find_by(user_id: user_id, eventlist_id: @eventlist.id)

    if @saved_event
      @saved_event.destroy
      # Optionally update the event itself if it has an isSaved field
      # @eventlist.update(isSaved: false) # <-- Again, be careful here
      render json: { status: 'success', saved: false }
    else
      render json: { status: 'error', message: 'Event not found or not saved by user' }, status: :not_found
    end
  end

  private

  def set_eventlist
    # Use params[:id] because this is triggered by a member route on eventlists
    @eventlist = Eventlist.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { status: 'error', message: 'Eventlist not found' }, status: :not_found
  end

  # Helper method to get current user ID from JWT token (Auth0 sub claim)
  # This should ideally be in ApplicationController or a concern
  def current_user_id
    token = request.headers['Authorization']&.split(' ')&.last
    return nil unless token

    begin
      decoded_token = JWT.decode(token, nil, false) # Decode without verification for user ID
      # Assuming the user ID is stored in the 'sub' claim, common for Auth0
      user_id = decoded_token[0]['sub']
      Rails.logger.debug "Current User ID (sub): #{user_id}"
      return user_id
    rescue JWT::DecodeError => e
      Rails.logger.error("JWT Decode Error: #{e.message}")
      return nil
    rescue KeyError => e
      Rails.logger.error("JWT Missing 'sub' claim: #{e.message}")
      return nil
    end
  end
end 
class JobsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]
  before_action :set_job, only: [:show, :update, :destroy]

  # GET /jobs
  def index
    @jobs = Job.all
    
    # Add saved status for the current user if authenticated
    token = request.headers['Authorization']&.split(' ')&.last
    
    if token
      begin
        # Try to extract user_id from token
        decoded_token = JWT.decode(token, nil, false)[0]
        user_id = decoded_token['sub']
        
        if user_id
          # Log for debugging
          Rails.logger.debug "Checking saved status for user: #{user_id}"
          
          # Get IDs of all jobs saved by this user
          saved_job_ids = SavedJob.where(user_id: user_id).pluck(:job_id)
          Rails.logger.debug "User has saved job IDs: #{saved_job_ids}"
          
          # Map jobs with saved status
          @jobs = @jobs.map do |job|
            is_saved = saved_job_ids.include?(job.id)
            Rails.logger.debug "Job #{job.id} saved status: #{is_saved}"
            job.as_json.merge(is_saved: is_saved)
          end
        else
          # No user ID found, mark all as not saved
          @jobs = @jobs.map { |job| job.as_json.merge(is_saved: false) }
        end
      rescue => e
        # Log error but continue with jobs unmarked as saved
        Rails.logger.error "Error determining saved status: #{e.message}"
        @jobs = @jobs.map { |job| job.as_json.merge(is_saved: false) }
      end
    else
      # No token, mark all as not saved
      @jobs = @jobs.map { |job| job.as_json.merge(is_saved: false) }
    end
    
    render json: @jobs
  end

  # GET /jobs/:id
  def show
    # Check if job is saved by current user if authenticated
    is_saved = false
    
    token = request.headers['Authorization']&.split(' ')&.last
    if token
      begin
        decoded_token = JWT.decode(token, nil, false)[0]
        user_id = decoded_token['sub']
        
        if user_id
          is_saved = SavedJob.exists?(user_id: user_id, job_id: @job.id)
        end
      rescue => e
        Rails.logger.error "Error checking saved status: #{e.message}"
      end
    end
    
    render json: @job.as_json.merge(is_saved: is_saved)
  end

  # POST /jobs
  def create
    @job = Job.new(job_params)

    if @job.save
      render json: { message: "Job created successfully", job: @job }, status: :created
    else
      render json: { errors: @job.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /jobs/1
  def update
    if @job.update(job_params)
      render json: @job
    else
      render json: @job.errors, status: :unprocessable_entity
    end
  end

  # DELETE /jobs/:id
  def destroy
    @job.destroy
    head :no_content
  end

  private

  def set_job
    @job = Job.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Job not found' }, status: :not_found
  end

  def job_params
    params.require(:job).permit(:title, :company, :location, :description, :requirements, :salary, :contact, :logo_url)
  end

  def current_user_id
    # This matches the Auth0 sub field
    # Would normally be set by your auth middleware
    request.env['current_user_id'] || @current_user_id
  end
end
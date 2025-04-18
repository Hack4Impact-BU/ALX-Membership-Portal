class SavedJobsController < ApplicationController
  before_action :authenticate_request
  before_action :set_job, only: [:create, :destroy]
  skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]

  # GET /saved_jobs
  # Returns all jobs saved by current user
  def index
    user_id = current_user_id
    
    Rails.logger.debug "Fetching saved jobs for user: #{user_id}"
    
    # Get all job IDs saved by this user
    saved_job_ids = SavedJob.where(user_id: user_id).pluck(:job_id)
    
    # Find all those jobs
    @saved_jobs = Job.where(id: saved_job_ids)
    
    # Add is_saved=true to all of them (since this is the saved_jobs endpoint)
    @saved_jobs = @saved_jobs.map do |job|
      job.as_json.merge(is_saved: true)
    end
    
    render json: @saved_jobs
  end

  # POST /jobs/:job_id/save
  # Save a job for current user
  def create
    # Check if job is already saved by this user
    user_id = current_user_id
    existing = SavedJob.find_by(user_id: user_id, job_id: @job.id)
    
    if existing
      # Already saved, just return success
      return render json: { status: 'success', saved: true, message: 'Job already saved' }
    end
    
    @saved_job = SavedJob.new(
      user_id: user_id,
      job_id: @job.id
    )

    if @saved_job.save
      render json: { status: 'success', saved: true }, status: :created
    else
      render json: { status: 'error', errors: @saved_job.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /jobs/:job_id/save
  # Unsave a job for current user
  def destroy
    @saved_job = SavedJob.find_by(user_id: current_user_id, job_id: @job.id)
    
    if @saved_job
      @saved_job.destroy
      render json: { status: 'success', saved: false }
    else
      render json: { status: 'error', message: 'Job not found or not saved' }, status: :not_found
    end
  end

  private
  
  def set_job
    @job = Job.find(params[:job_id])
  rescue ActiveRecord::RecordNotFound
    render json: { status: 'error', message: 'Job not found' }, status: :not_found
  end
  
  def current_user_id
    return @current_user[:sub] if defined?(@current_user) && @current_user
    return request.env['current_user_id'] if request.env['current_user_id']
    
    token = request.headers['Authorization']&.split(' ')&.last
    if token
      begin
        decoded_token = JWT.decode(token, nil, false)[0]
        return decoded_token['sub']
      rescue => e
        Rails.logger.error("Failed to decode token: #{e.message}")
      end
    end
    
    nil
  end
end 
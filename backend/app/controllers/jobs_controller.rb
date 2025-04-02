class JobsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create, :index, :show, :destroy, :update]
  before_action :set_job, only: [:show, :update, :destroy]

  # GET /jobs
  def index
    @jobs = Job.all
    render json: @jobs.map { |job| job.as_json.merge(logo_url: job.logo.attached? ? url_for(job.logo) : nil) }
  end

  # GET /jobs/:id
  def show
    render json: @job
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

  # PUT /jobs/:id
  def update
    if @job.update(job_params)
      render json: @job
    else
      render json: { errors: @job.errors.full_messages }, status: :unprocessable_entity
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
    render json: { error: "Job not found" }, status: :not_found
  end

  def job_params
    params.require(:job).permit(:title, :company, :location, :job_type, :description, :requirements, :contact, :salary, :logo)
  end
end
Rails.application.routes.draw do
  # Resourceful routes with editing capabilities
  resources :product_offers
  resources :get_involveds
  resources :eventlists
  resources :jobs
  resources :q_and_as, only: [:index, :show, :new, :create, :update, :destroy]
  resources :research
  resources :training

  # Custom routes
  get "up" => "rails/health#show", as: :rails_health_check
  get '/profile', to: 'users#profile'
  post 'auth0/sign_up', to: 'auth0#sign_up'
  post 'auth0/login', to: 'auth0#login'
  post 'auth0/token', to: 'auth0#token'


  # Additional API endpoints
  get '/users', to: 'users#index'
  # The following line may be redundant with `resources :get_involveds`
  # get '/get_involved', to: 'get_involveds#index'
  
  # This custom route may be redundant with `resources :q_and_as`
  get '/q_and_a', to: 'q_and_as#index'

  # Job routes with nested save functionality
  resources :jobs, only: [:index, :show, :create, :update, :destroy] do
    post 'save', to: 'saved_jobs#create', on: :member
    delete 'save', to: 'saved_jobs#destroy', on: :member
  end
  
  # Get all saved jobs for the current user
  get 'saved_jobs', to: 'saved_jobs#index'

  # Event routes with nested save functionality
  resources :eventlists, only: [:index, :show, :create, :update, :destroy] do
    post 'save', to: 'saved_events#create', on: :member
    delete 'save', to: 'saved_events#destroy', on: :member
  end
  # Get all saved events for the current user
  get 'saved_events', to: 'saved_events#index'

  # Product Offer routes with nested save functionality
  resources :product_offers, only: [:index, :show, :create, :update, :destroy] do
    post 'save', to: 'saved_product_offers#create', on: :member
    delete 'save', to: 'saved_product_offers#destroy', on: :member
  end
  get 'saved_product_offers', to: 'saved_product_offers#index'

  # Uncomment and set your root route if needed
  # root "posts#index"
end
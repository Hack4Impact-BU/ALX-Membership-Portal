Rails.application.routes.draw do
  # Resourceful routes
  resources :get_involveds
  resources :eventlists
  resources :jobs, only: [:index, :create, :show]
  resources :q_and_as, only: [:index, :show, :new, :create, :destroy]

  # Custom routes
  get "up" => "rails/health#show", as: :rails_health_check
  get '/profile', to: 'users#profile'
  post 'auth0/sign_up', to: 'auth0#sign_up'
  post 'auth0/login', to: 'auth0#login'

  # Additional API endpoints (if you really need them in addition to the resourceful ones)
  get '/users', to: 'users#index'
  # The following line may be redundant with `resources :get_involveds`
  # get '/get_involved', to: 'get_involveds#index'
  
  # This custom route may be redundant with `resources :q_and_as`
  get '/q_and_a', to: 'q_and_as#index'

  # Uncomment and set your root route if needed
  # root "posts#index"
end
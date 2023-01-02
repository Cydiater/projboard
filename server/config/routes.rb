Rails.application.routes.draw do
  scope '/api', defaults: { format: :json } do
    resources :users do
      resources :projects
    end
    post 'auth/login', to: 'authentication#login'
    get 'auth/refresh', to: 'authentication#refresh'
    get 'projects', to: 'projects#list_all'
  end
end

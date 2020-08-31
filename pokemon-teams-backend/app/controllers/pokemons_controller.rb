require "faker"

class PokemonsController < ApplicationController
  def index
    render :json => Pokemon.all
  end

  def create
    # add validation by checking number of pokemons that trainer trainerId has
    render :json => Pokemon.create(
      nickname: Faker::Name.first_name, 
      species: Faker::Games::Pokemon.name, 
      trainer_id: params[:trainerId]
    )
  end

  def destroy
    Pokemon.find(params[:id]).destroy
  end
end

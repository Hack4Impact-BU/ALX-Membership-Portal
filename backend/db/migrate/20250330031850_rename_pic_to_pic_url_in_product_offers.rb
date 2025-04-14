class RenamePicToPicUrlInProductOffers < ActiveRecord::Migration[7.2]
  def change
    rename_column :product_offers, :pic, :pic_url
  end
end

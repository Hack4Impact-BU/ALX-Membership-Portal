class CreateGetInvolveds < ActiveRecord::Migration[7.2]
  def change
    create_table :get_involveds do |t|
      t.string :title
      t.text :summary
      t.text :description
      t.date :date
      t.string :time
      t.string :location
      t.string :phone

      t.timestamps
    end
  end
end

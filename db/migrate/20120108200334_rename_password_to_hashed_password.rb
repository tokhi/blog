class RenamePasswordToHashedPassword < ActiveRecord::Migration
  def up
	rename_column :users, :password, :hashed_password
  end

  def down
  end
end

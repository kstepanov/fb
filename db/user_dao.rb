require_relative "dao"

class UserDAO < DAO
  db.create_table(:users) do
    primary_key :id
    String :name
    String :mobile
    String :email, index: true, unique: true
    Integer :created_at
  end unless db.table_exists?(:users)
  
  class << self
    def save(user)
      db[:users].insert name: user.name, mobile: user.mobile, email: user.email, created_at: user.created_at.to_i
    end

    def delete_all
      db[:users].delete
    end

    def all
      db[:users].order(:id).all
    end

    def find_by_email(email)
      db[:users].filter(email: email).first
    end
    
    #def find_all_by_due_on(due_date)
    #  db[:tasks].filter(due_on: due_date).order(:id).all
    #end
    
  end
end

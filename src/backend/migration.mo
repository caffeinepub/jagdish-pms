import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    name : Text;
  };

  type NewUserProfile = {
    gmail : Text;
    name : Text;
    registeredAt : Int;
    lastSeen : Int;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          gmail = "";
          name = oldProfile.name;
          registeredAt = Time.now();
          lastSeen = Time.now();
        };
      }
    );
    { userProfiles = newUserProfiles };
  };
};

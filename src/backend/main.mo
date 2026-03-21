import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Types
  public type FundCategory = {
    #equity;
    #debt;
    #hybrid;
    #elss;
  };

  public type Fund = {
    id : Text;
    name : Text;
    category : FundCategory;
    currentNav : Nat; // in paise
    lastNavUpdate : Time.Time;
  };

  public type TransactionType = {
    #buy;
    #sell;
    #sip;
  };

  public type Transaction = {
    fundId : Text;
    transactionType : TransactionType;
    units : Nat;
    navPerUnit : Nat; // in paise
    amount : Nat; // in paise
    date : Time.Time;
  };

  public type Holding = {
    fundId : Text;
    units : Nat;
    avgCostNav : Nat; // in paise
  };

  public type PortfolioSummary = {
    investedAmount : Nat;
    currentValue : Nat;
    gainLoss : Int;
    holdings : [HoldingSummary];
  };

  public type HoldingSummary = {
    fundId : Text;
    units : Nat;
    amountInvested : Nat;
    currentValue : Nat;
    gainLoss : Int;
  };

  public type CapitalGainsReport = {
    totalStcg : Nat;
    totalLtcg : Nat;
    details : [FundCapitalGain];
  };

  public type FundCapitalGain = {
    fundId : Text;
    stcg : Nat;
    ltcg : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  public type BlogPost = {
    id : Text;
    title : Text;
    summary : Text;
    content : [Text];
    author : Text;
    categories : [Text];
    tags : [Text];
    readTime : Text;
    status : PostStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    scheduledAt : ?Time.Time;
  };

  public type PostStatus = { #published; #draft; #privateVisibility };

  public type CreateBlogPostInput = {
    title : Text;
    summary : Text;
    content : [Text];
    author : Text;
    categories : [Text];
    tags : [Text];
    readTime : Text;
    status : PostStatus;
    scheduledAt : ?Time.Time;
  };

  public type UpdateBlogPostInput = {
    id : Text;
    title : Text;
    summary : Text;
    content : [Text];
    author : Text;
    categories : [Text];
    tags : [Text];
    readTime : Text;
    status : PostStatus;
    scheduledAt : ?Time.Time;
  };

  // Admin export types
  public type UserTransactionRecord = {
    principal : Text;
    userName : Text;
    fundId : Text;
    transactionType : Text;
    units : Nat;
    navPerUnit : Nat;
    amount : Nat;
    date : Time.Time;
  };

  public type UserHoldingRecord = {
    principal : Text;
    userName : Text;
    fundId : Text;
    units : Nat;
    avgCostNav : Nat;
  };

  public type UserRecord = {
    principal : Text;
    name : Text;
  };

  public type UserCapitalGainsRecord = {
    principal : Text;
    userName : Text;
    fundId : Text;
    stcg : Nat;
    ltcg : Nat;
  };

  // Custom modules for sorting and comparison
  module Fund {
    public func compare(f1 : Fund, f2 : Fund) : Order.Order {
      Text.compare(f1.id, f2.id);
    };
  };

  module Transaction {
    public func compareByDate(t1 : Transaction, t2 : Transaction) : Order.Order {
      Int.compare(t1.date, t2.date);
    };
  };

  module Holding {
    public func compareByFundId(h1 : Holding, h2 : Holding) : Order.Order {
      Text.compare(h1.fundId, h2.fundId);
    };
  };

  module BlogPostSort {
    public func compareByCreatedAt(p1 : BlogPost, p2 : BlogPost) : Order.Order {
      if (p1.createdAt == p2.createdAt) { Text.compare(p1.id, p2.id) } else {
        Int.compare(p1.createdAt, p2.createdAt);
      };
    };
  };

  // State
  let funds = Map.empty<Text, Fund>();
  let userTransactions = Map.empty<Principal, List.List<Transaction>>();
  let userHoldings = Map.empty<Principal, Map.Map<Text, Holding>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let blogPosts = Map.empty<Text, BlogPost>();

  var nextPostId = 1;

  let tags = List.fromArray(["ELSS", "SIP", "Capital Gains", "NAV", "Mutual Fund", "Tax Saving", "LTCG", "STCG", "Dividend", "Redemption", "Switch", "Lump Sum", "Portfolio", "Rebalancing", "Goal Planning", "Risk Profile", "CAS", "CAMS", "KFintech", "NSDL", "AMC", "Broker", "ITR", "Bank Reconciliation", "Document Wallet", "Robo Advisory", "Version Guide", "Android App", "Affiliate"]);
  let categories = List.fromArray(["Vision", "Technology", "Architecture", "Features", "Finance", "Design", "Roadmap", "Infrastructure", "Developer Guide", "History", "Growth", "Troubleshooting", "User Guide", "Release Notes", "FAQ", "Consumer Education", "Excel Users", "Google Sheets Users", "Platform Guide", "Version Guide"]);

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // One-time bootstrap: first logged-in user to call this becomes admin.
  // Once an admin is assigned, this function does nothing.
  var firstAdminBootstrapped : Bool = false;

  public shared ({ caller }) func bootstrapFirstAdmin() : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    if (firstAdminBootstrapped) {
      // Already bootstrapped -- return whether caller is admin
      return AccessControl.isAdmin(accessControlState, caller);
    };
    // No admin yet -- make the caller the admin
    firstAdminBootstrapped := true;
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    true;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Fund Management
  public shared ({ caller }) func addFund(id : Text, name : Text, category : FundCategory, initialNav : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add funds");
    };
    if (funds.containsKey(id)) {
      Runtime.trap("Fund already exists");
    };
    let fund : Fund = {
      id;
      name;
      category;
      currentNav = initialNav;
      lastNavUpdate = Time.now();
    };
    funds.add(id, fund);
  };

  public shared ({ caller }) func updateNav(fundId : Text, newNav : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update NAV");
    };
    switch (funds.get(fundId)) {
      case (null) { Runtime.trap("Fund not found") };
      case (?fund) {
        let updatedFund : Fund = {
          fund with
          currentNav = newNav;
          lastNavUpdate = Time.now();
        };
        funds.add(fundId, updatedFund);
      };
    };
  };

  public query ({ caller }) func getAllFunds() : async [Fund] {
    // Accessible to all users including guests
    funds.values().toArray().sort();
  };

  // Transaction Management
  public shared ({ caller }) func addTransaction(fundId : Text, transactionType : TransactionType, units : Nat, navPerUnit : Nat, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add transactions");
    };
    switch (funds.get(fundId)) {
      case (null) { Runtime.trap("Fund not found") };
      case (?_) {
        let transaction : Transaction = {
          fundId;
          transactionType;
          units;
          navPerUnit;
          amount;
          date = Time.now();
        };

        // Update transactions
        let transactions = switch (userTransactions.get(caller)) {
          case (null) { List.empty<Transaction>() };
          case (?existing) { existing };
        };
        transactions.add(transaction);
        userTransactions.add(caller, transactions);

        // Update holdings for buy/SIP
        switch (transactionType) {
          case (#buy) { updateHoldingsInternal(caller, fundId, units, navPerUnit) };
          case (#sip) { updateHoldingsInternal(caller, fundId, units, navPerUnit) };
          case (#sell) { () };
        };
      };
    };
  };

  public query ({ caller }) func getTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    switch (userTransactions.get(caller)) {
      case (null) { [] };
      case (?transactions) { transactions.toArray().sort(Transaction.compareByDate) };
    };
  };

  public query ({ caller }) func getHoldings() : async [Holding] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view holdings");
    };
    switch (userHoldings.get(caller)) {
      case (null) { [] };
      case (?holdingMap) {
        holdingMap.values().toArray().sort(Holding.compareByFundId);
      };
    };
  };

  // Helper function to update holdings (PRIVATE - not exposed as public)
  private func updateHoldingsInternal(user : Principal, fundId : Text, units : Nat, navPerUnit : Nat) {
    let userHoldingMap = switch (userHoldings.get(user)) {
      case (null) { Map.empty<Text, Holding>() };
      case (?existing) { existing };
    };

    let currentHolding = switch (userHoldingMap.get(fundId)) {
      case (null) {
        {
          fundId;
          units;
          avgCostNav = navPerUnit;
        };
      };
      case (?holding) {
        let totalUnits = holding.units + units;
        let totalCost = (holding.units * holding.avgCostNav) + (units * navPerUnit);
        let newAvgNav = if (totalUnits > 0) { totalCost / totalUnits } else { 0 };
        {
          fundId;
          units = totalUnits;
          avgCostNav = newAvgNav;
        };
      };
    };

    userHoldingMap.add(fundId, currentHolding);
    userHoldings.add(user, userHoldingMap);
  };

  // Portfolio Summary
  public query ({ caller }) func getPortfolioSummary() : async PortfolioSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view portfolio summary");
    };
    let holdings = switch (userHoldings.get(caller)) {
      case (null) { Map.empty<Text, Holding>() };
      case (?h) { h };
    };

    let holdingList = holdings.values().toArray();
    let holdingSummaries = holdingList.map(
      func(holding) {
        switch (funds.get(holding.fundId)) {
          case (null) {
            {
              fundId = holding.fundId;
              units = holding.units;
              amountInvested = 0;
              currentValue = 0;
              gainLoss = 0;
            };
          };
          case (?fund) {
            let amountInvested = holding.avgCostNav * holding.units;
            let currentValue = fund.currentNav * holding.units;
            let gainLoss = currentValue.toInt() - amountInvested.toInt();
            {
              fundId = holding.fundId;
              units = holding.units;
              amountInvested;
              currentValue;
              gainLoss;
            };
          };
        };
      }
    );

    let investedAmount = holdingSummaries.foldLeft(
      0,
      func(acc, hs) { hs.amountInvested + acc },
    );
    let currentValue = holdingSummaries.foldLeft(
      0,
      func(acc, hs) { hs.currentValue + acc },
    );
    let gainLoss = currentValue.toInt() - investedAmount.toInt();

    {
      investedAmount;
      currentValue;
      gainLoss;
      holdings = holdingSummaries;
    };
  };

  // Capital Gains Report
  public shared ({ caller }) func getCapitalGainsReport() : async CapitalGainsReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view capital gains report");
    };
    let transactions = switch (userTransactions.get(caller)) {
      case (null) { List.empty<Transaction>() };
      case (?existing) { existing };
    };
    let allTransactions = transactions.toArray();

    let fundsWithSells = allTransactions.filter(
      func(tx) { switch (tx.transactionType) { case (#sell) { true }; case (_) { false } } }
    );

    // Get unique fund IDs using Map
    let fundMap = Map.empty<Text, ()>();
    for (tx in fundsWithSells.values()) {
      fundMap.add(tx.fundId, ());
    };
    let fundIds = fundMap.keys().toArray();

    let gainDetails = fundIds.map(
      func(fundId) {
        calculateGainsForFundInternal(fundId, allTransactions);
      }
    );

    // Calculate totals using foldLeft
    let totalStcg = gainDetails.foldLeft(
      0,
      func(acc, detail) { acc + detail.stcg },
    );
    let totalLtcg = gainDetails.foldLeft(
      0,
      func(acc, detail) { acc + detail.ltcg },
    );

    {
      totalStcg;
      totalLtcg;
      details = gainDetails;
    };
  };

  // Helper: Calculate gains for single fund (simplified FIFO) - PRIVATE
  private func calculateGainsForFundInternal(fundId : Text, transactions : [Transaction]) : FundCapitalGain {
    let fundTransactions = transactions.filter(func(tx) { tx.fundId == fundId });
    let buyTransactions = fundTransactions.filter(
      func(tx) { switch (tx.transactionType) { case (#buy) { true }; case (#sip) { true }; case (_) { false } } }
    );
    let sellTransactions = fundTransactions.filter(
      func(tx) { switch (tx.transactionType) { case (#sell) { true }; case (_) { false } } }
    );

    var totalStcg = 0;
    var totalLtcg = 0;

    for (sellTx in sellTransactions.values()) {
      let sellDate = sellTx.date;

      for (buyTx in buyTransactions.values()) {
        let holdingPeriod = sellDate - buyTx.date;
        let gain = Int.abs((sellTx.navPerUnit * sellTx.units) - (buyTx.navPerUnit * buyTx.units));

        if (holdingPeriod < (365 * 24 * 60 * 60 * 1_000_000_000)) {
          totalStcg += gain;
        } else {
          totalLtcg += gain;
        };
      };
    };

    {
      fundId;
      stcg = totalStcg;
      ltcg = totalLtcg;
    };
  };

  // ADMIN DATA EXPORT

  // Get all registered users (admin only)
  public query ({ caller }) func adminGetAllUsers() : async [UserRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can export user data");
    };
    userProfiles.entries().toArray().map(
      func((principal, profile)) {
        {
          principal = principal.toText();
          name = profile.name;
        };
      }
    );
  };

  // Get all transactions across all users (admin only)
  public query ({ caller }) func adminGetAllTransactions() : async [UserTransactionRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can export transaction data");
    };
    let result = List.empty<UserTransactionRecord>();
    for ((principal, txList) in userTransactions.entries().toArray().values()) {
      let userName = switch (userProfiles.get(principal)) {
        case (null) { "Unknown" };
        case (?p) { p.name };
      };
      let principalText = principal.toText();
      for (tx in txList.toArray().values()) {
        let txTypeText = switch (tx.transactionType) {
          case (#buy) { "buy" };
          case (#sell) { "sell" };
          case (#sip) { "sip" };
        };
        result.add({
          principal = principalText;
          userName;
          fundId = tx.fundId;
          transactionType = txTypeText;
          units = tx.units;
          navPerUnit = tx.navPerUnit;
          amount = tx.amount;
          date = tx.date;
        });
      };
    };
    result.toArray();
  };

  // Get all holdings across all users (admin only)
  public query ({ caller }) func adminGetAllHoldings() : async [UserHoldingRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can export holdings data");
    };
    let result = List.empty<UserHoldingRecord>();
    for ((principal, holdingMap) in userHoldings.entries().toArray().values()) {
      let userName = switch (userProfiles.get(principal)) {
        case (null) { "Unknown" };
        case (?p) { p.name };
      };
      let principalText = principal.toText();
      for (holding in holdingMap.values().toArray().values()) {
        result.add({
          principal = principalText;
          userName;
          fundId = holding.fundId;
          units = holding.units;
          avgCostNav = holding.avgCostNav;
        });
      };
    };
    result.toArray();
  };

  // Get capital gains for all users (admin only)
  public query ({ caller }) func adminGetAllCapitalGains() : async [UserCapitalGainsRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can export capital gains data");
    };
    let result = List.empty<UserCapitalGainsRecord>();
    for ((principal, txList) in userTransactions.entries().toArray().values()) {
      let userName = switch (userProfiles.get(principal)) {
        case (null) { "Unknown" };
        case (?p) { p.name };
      };
      let principalText = principal.toText();
      let allTx = txList.toArray();

      let fundsWithSells = allTx.filter(
        func(tx) { switch (tx.transactionType) { case (#sell) { true }; case (_) { false } } }
      );
      let fundMap = Map.empty<Text, ()>();
      for (tx in fundsWithSells.values()) {
        fundMap.add(tx.fundId, ());
      };
      let fundIds = fundMap.keys().toArray();

      for (fundId in fundIds.values()) {
        let gains = calculateGainsForFundInternal(fundId, allTx);
        result.add({
          principal = principalText;
          userName;
          fundId;
          stcg = gains.stcg;
          ltcg = gains.ltcg;
        });
      };
    };
    result.toArray();
  };

  // BLOG POST MANAGEMENT

  // Get the current nextPostId for debugging/testing
  public query ({ caller }) func getNextPostId() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get next post id");
    };
    nextPostId;
  };

  // Get all published posts (public endpoint)
  public query ({ caller }) func getPublishedPosts() : async [BlogPost] {
    blogPosts.values().toArray().filter(
      func(post) {
        switch (post.status) {
          case (#published) {
            switch (post.scheduledAt) {
              case (null) { true }; // No scheduled time = visible
              case (?datetime) { datetime <= Time.now() }; // Only show scheduled posts when scheduledAt is in the past
            };
          };
          case (_) { false };
        };
      }
    ).sort(BlogPostSort.compareByCreatedAt);
  };

  // Get all posts (admin only)
  public query ({ caller }) func getAllPosts() : async [BlogPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get all posts");
    };
    blogPosts.values().toArray().sort(BlogPostSort.compareByCreatedAt);
  };

  // Get single post by id (public if published, admin for all)
  public query ({ caller }) func getPostById(postId : Text) : async ?BlogPost {
    switch (blogPosts.get(postId)) {
      case (null) { null };
      case (?post) {
        // Non-admin callers can only see published posts that meet the schedule criteria
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
          switch (post.status) {
            case (#published) {
              switch (post.scheduledAt) {
                case (null) { ?post }; // No scheduled time = visible
                case (?datetime) {
                  if (datetime <= Time.now()) { ?post } else { null };
                };
              };
            };
            case (_) { null };
          };
        } else {
          // Admins can see all posts regardless of status or schedule
          ?post;
        };
      };
    };
  };

  // Create new post (admin only)
  public shared ({ caller }) func createPost(input : CreateBlogPostInput) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create posts");
    };

    let postId = nextPostId.toText();
    nextPostId += 1;

    let newPost : BlogPost = {
      id = postId;
      title = input.title;
      summary = input.summary;
      content = input.content;
      author = input.author;
      categories = input.categories;
      tags = input.tags;
      readTime = input.readTime;
      status = input.status;
      createdAt = Time.now();
      updatedAt = Time.now();
      scheduledAt = input.scheduledAt;
    };

    blogPosts.add(postId, newPost);
    postId;
  };

  // Update existing post (admin only)
  public shared ({ caller }) func updatePost(input : UpdateBlogPostInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update posts");
    };

    switch (blogPosts.get(input.id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existing) {
        let updatedPost : BlogPost = {
          id = input.id;
          title = input.title;
          summary = input.summary;
          content = input.content;
          author = input.author;
          categories = input.categories;
          tags = input.tags;
          readTime = input.readTime;
          status = input.status;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
          scheduledAt = input.scheduledAt;
        };
        blogPosts.add(input.id, updatedPost);
      };
    };
  };

  // Update only the scheduledAt field of a post (admin only)
  public shared ({ caller }) func updatePostSchedule(postId : Text, scheduledAt : ?Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update post schedules");
    };

    switch (blogPosts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existing) {
        let updatedPost : BlogPost = {
          existing with
          scheduledAt;
          updatedAt = Time.now();
        };
        blogPosts.add(postId, updatedPost);
      };
    };
  };

  // Reschedule all posts (admin only)
  public shared ({ caller }) func adminRescheduleAllPosts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reschedule posts");
    };

    let allPosts = blogPosts.values().toArray().filter(func(p) { switch (p.status) { case (#published) { true }; case (_) { false } } }).sort(BlogPostSort.compareByCreatedAt);
    let todayNanos = Time.now();
    let twoDaysNanos = 2 * 24 * 60 * 60 * 1_000_000_000;

    for (i in Nat.range(0, allPosts.size())) {
      let post = allPosts[i];
      let newScheduledAt : Time.Time = todayNanos + (i * twoDaysNanos);
      let updatedPost : BlogPost = {
        post with
        scheduledAt = ?newScheduledAt;
        updatedAt = Time.now();
      };
      blogPosts.add(post.id, updatedPost);
    };
  };

  // Delete post (admin only)
  public shared ({ caller }) func deletePost(postId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };

    switch (blogPosts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?_) {
        blogPosts.remove(postId);
      };
    };
  };

  // BLOG TAGS / CATEGORIES

  // Retrieve all tags (non-admin as well)
  public query ({ caller }) func getAllTags() : async [Text] {
    tags.toArray();
  };

  // Retrieve all categories (non-admin as well)
  public query ({ caller }) func getAllCategories() : async [Text] {
    categories.toArray();
  };

  // Add a tag (admin only)
  public shared ({ caller }) func addTag(tag : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add tags");
    };
    let trimmedTag = trimTextInternal(capitalizeFirstCharInternal(tag));
    if (trimmedTag == "") {
      Runtime.trap("Empty tag is not allowed");
    };

    // Check if tag already exists (case-insensitive)
    let exists = tags.toArray().find(func(t) { t.toLower() == trimmedTag.toLower() }) != null;
    if (exists) {
      Runtime.trap("Tag already exists");
    };

    tags.add(trimmedTag);
  };

  // Delete a tag (admin only)
  public shared ({ caller }) func deleteTag(tag : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete tags");
    };

    // Remove using filter based on exact match
    let filteredTags = tags.toArray().filter(func(t) { t != tag });
    tags.clear();
    let iter = filteredTags.values();
    loop {
      switch (iter.next()) {
        case (null) { return };
        case (?t) { tags.add(t) };
      };
    };
  };

  // Add a category (admin only)
  public shared ({ caller }) func addCategory(category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };
    let trimmedCategory = trimTextInternal(capitalizeFirstCharInternal(category));
    if (trimmedCategory == "") {
      Runtime.trap("Empty category is not allowed");
    };

    // Check if category already exists (case-insensitive)
    let exists = categories.toArray().find(func(c) { c.toLower() == trimmedCategory.toLower() }) != null;
    if (exists) {
      Runtime.trap("Category already exists");
    };

    categories.add(trimmedCategory);
  };

  // Delete a category (admin only)
  public shared ({ caller }) func deleteCategory(category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };

    // Remove using filter based on exact match
    let filteredCategories = categories.toArray().filter(func(c) { c != category });
    categories.clear();
    let iter = filteredCategories.values();
    loop {
      switch (iter.next()) {
        case (null) { return };
        case (?c) { categories.add(c) };
      };
    };
  };

  // Helper functions for string manipulation
  private func trimTextInternal(text : Text) : Text {
    text.trim(#predicate(func(c) { c == ' ' }));
  };

  private func capitalizeFirstCharInternal(text : Text) : Text {
    if (text == "") { return text };
    let chars = text.toArray();
    if (chars.size() == 0) { return text };
    let firstChar = chars[0];
    let rest = chars.sliceToArray(1, chars.size());
    let firstUpper = capitalizeInternal(firstChar);
    firstUpper # Text.fromArray(rest);
  };

  private func capitalizeInternal(c : Char) : Text {
    let lower : [Char] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let upper : [Char] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let cText = c.toText();
    let lowerIndex = lower.findIndex(func(l) { l.toText() == cText });
    switch (lowerIndex) {
      case (null) { c.toText() }; // not a lowercase letter
      case (?i) { upper[i].toText() };
    };
  };
};

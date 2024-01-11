import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [spiltBill, setSpiltBill] = useState(null);

  function handleSetShowAddFriend() {
    setShowAddFriend(!showAddFriend);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handlespiltBillForm(friend) {
    setSpiltBill(friend);
  }

  function handleRebalance(friend) {
    setFriends(friend);
    setSpiltBill(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} onSpiltBillFormOn={handlespiltBillForm} />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleSetShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      <div>
        {spiltBill && (
          <FormSplitBill
            friend={spiltBill}
            onSpiltBill={setSpiltBill}
            onRebalance={handleRebalance}
            friends={friends}
          />
        )}
      </div>
    </div>
  );
}

function FriendList({ friends, onSpiltBillFormOn }) {
  return (
    <ul>
      {friends.map((friend) => (
        <ul key={friend.id}>
          <Friend
            friend={friend}
            key={friend.id}
            onSpiltBillFormOn={onSpiltBillFormOn}
          />
        </ul>
      ))}
    </ul>
  );
}

function Friend({ friend, onSpiltBillFormOn }) {
  return (
    <li key={friend.id}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance === 0 && <p>{`You and ${friend.name} are even`}</p>}
      {friend.balance > 0 && (
        <p className="green">{`${friend.name} own you $${Math.abs(
          friend.balance
        )}`}</p>
      )}
      {friend.balance < 0 && (
        <p className="red">{`You own ${friend.name} $${Math.abs(
          friend.balance
        )}`}</p>
      )}
      <Button onClick={() => onSpiltBillFormOn(friend)}>Select</Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("https://i.pravatar.cc/48?u=499476");
  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !imageUrl) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${imageUrl}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩🏻‍🤝‍🧑🏻Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>💶Image URL</label>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={() => onClick && onClick()}>
      {children}
    </button>
  );
}

function FormSplitBill({ friend, onRebalance, friends }) {
  const [totalExpense, setTotalExpense] = useState(0);
  const [userExpense, setUserExpense] = useState(0);
  const [spender, setSpender] = useState("user");

  function handleTotalExpense(value) {
    const numberValue = parseInt(value);
    setTotalExpense(typeof numberValue === "number" ? numberValue : 0);
  }
  function handleUserExpense(value) {
    const numberValue = parseInt(value);
    setUserExpense(typeof numberValue === "number" ? numberValue : 0);
  }
  function handleSpender(value) {
    setSpender(value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    const newBalance =
      spender === "user"
        ? friend.balance + totalExpense - userExpense
        : friend.balance - userExpense;

    const friendNewBalance = {
      id: friend.id,
      name: friend.name,
      image: friend.image,
      balance: newBalance,
    };

    const newBalanceFriends = friends.map((friend) => {
      return friend.id === friendNewBalance.id ? friendNewBalance : friend;
    });

    onRebalance(newBalanceFriends);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>{`Split bill with ${friend.name}`}</h2>
      <label>{`💰split bill with ${friend.name}`}</label>
      <input
        type="text"
        value={totalExpense}
        onChange={(e) => handleTotalExpense(e.target.value)}
      />
      ~<label>{`🧍‍♂️Your expense`}</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) => handleUserExpense(e.target.value)}
      />
      <label>{`👩🏻‍🤝‍🧑🏼${friend.name}'s expense`}</label>
      <input type="text" value={totalExpense - userExpense} disabled />
      <label>{`🤑Who is paying the bill`}</label>
      <select
        name="spender"
        id="spender"
        onChange={(e) => handleSpender(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>
      <Button>Split</Button>
    </form>
  );
}

pragma solidity ^0.8.0;

contract VideoMarketplace {

    struct Video {
        address payable creator;
        uint256 id;
        string title;
        string description;
        uint256 views;
        uint256 likes;
        uint256 price;
    }

    mapping(uint256 => Video) public videos;
    uint256 public videoCount;

    event VideoAdded(uint256 id, address payable creator, string title, string description, uint256 price);

    function uploadVideo(string memory _title, string memory _description, uint256 _price) public payable {
        require(msg.value >= _price, 'Insufficient funds to upload video');
        videos[videoCount] = Video(payable(msg.sender), videoCount, _title, _description, 0, 0, _price);
        videoCount++;
        emit VideoAdded(videoCount - 1, payable(msg.sender), _title, _description, _price);
    }

    function watchVideo(uint256 _id) public payable {
        require(msg.value >= videos[_id].price, 'Insufficient funds to watch video');
        videos[_id].creator.transfer(msg.value);
        videos[_id].views++;
    }

    function likeVideo(uint256 _id) public {
        videos[_id].likes++;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
      require(_newOwner != address(0), "Invalid address");
      _transferOwnership(_newOwner);
    }

    modifier onlyOwner() {
      require(msg.sender == owner, "Only owner can call this function");
      _;
    }
}
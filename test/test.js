describe('NFTMarket', function () {
    it('Should interact with the token contract', async function () {
      const marketplaceContract = await ethers.getContractFactory('Material');
      const material = await marketplaceContract.deploy();
      await material.deployed();
      const marketAddress = material.address;
  
      const nftContract = await ethers.getContractFactory('NFT');
      const nft = await nftContract.deploy(marketAddress);
      await nft.deployed();
      const nftContractAddress = nft.address;
  
      let listingPrice = await material.getListingPrice();
      listingPrice = listingPrice.toString();
  
      const askingPrice = ethers.utils.parseUnits('1', 'ether');
  
      await nft.createToken('a');
      await nft.createToken('b');
      await nft.createToken('c');
  
      // create market item
      await material.createMarketItem(nftContractAddress, 1, 1);
      await material.createMarketItem(nftContractAddress, 2, 1);
      await material.createMarketItem(nftContractAddress, 3, 1);
  
      const [_, userAddress, userAddress2] = await ethers.getSigners();
  
      await material
        .connect(userAddress)
        .createMarketSale(nftContractAddress, 1, { value: listingPrice });
      await material
        .connect(userAddress2)
        .createMarketSale(nftContractAddress, 2, { value: listingPrice });
      await material
        .connect(userAddress2)
        .createMarketSale(nftContractAddress, 3, { value: listingPrice });
  
      transaction = await nft.createToken('d');
      transaction = await nft.createToken('e');
      transaction = await nft.createToken('f');
      transaction = await nft.createToken('g');
      transaction = await nft.createToken('h');
      transaction = await nft.createToken('i');
  
      await material.createMarketItem(nftContractAddress, 4, listingPrice);
      await material.createMarketItem(nftContractAddress, 5, listingPrice);
      await material.createMarketItem(nftContractAddress, 6, listingPrice);
      await material.createMarketItem(nftContractAddress, 7, listingPrice);
      await material.createMarketItem(nftContractAddress, 8, listingPrice);
      await material.createMarketItem(nftContractAddress, 9, listingPrice);
  
      //create marktet sale
      await material
        .connect(userAddress2)
        .createMarketSale(nftContractAddress, 4, { value: listingPrice }); // d
      await material
        .connect(userAddress2)
        .createMarketSale(nftContractAddress, 5, { value: listingPrice }); // e
      await material
        .connect(userAddress2)
        .createMarketSale(nftContractAddress, 6, { value: listingPrice }); // f
      await material
        .connect(userAddress2)
        .createMarketSale(nftContractAddress, 7, { value: listingPrice }); // g
  
      // resell token
      await material
        .connect(userAddress2)
        .resellToken(nftContractAddress, 4, { value: listingPrice });
      await material
        .connect(userAddress2)
        .resellToken(nftContractAddress, 5, { value: listingPrice });
      await material
        .connect(userAddress2)
        .resellToken(nftContractAddress, 6, { value: listingPrice });
      await material
        .connect(userAddress2)
        .resellToken(nftContractAddress, 7, { value: listingPrice });
  
      items = await material.fetchMarketItems();
      items = await Promise.all(
        items.map(async (i) => {
          const tokenUri = await nft.tokenURI(i.tokenId);
          let item = {
            price: i.price.toNumber(),
            tokenId: i.price.toNumber(),
            seller: i.seller,
            owner: i.owner,
            tokenUri,
          };
          return item;
        }),
      );
      console.log('items: ', items);
  
      const myNfts = await material.connect(userAddress2).fetchMyNFTs();
      console.log('myNfts:', myNfts);
    });
  });
  
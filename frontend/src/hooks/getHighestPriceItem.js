// const cart = [
// 	{
// 		cartQuntity: 5,
// 		image: 'jskd',
// 		price: 34,
// 	},
// 	{
// 		cartQuntity: 8,
// 		image: 'jskd',
// 		price: 36,
// 	},
// 	{
// 		cartQuntity: 3,
// 		image: 'jskd',
// 		price: 21,
// 	},
// 	{
// 		cartQuntity: 2,
// 		image: 'jskd',
// 		price: 12,
// 	},
// ];

// Find the item with the highest price
const getHighestPriceItem = (cart) => {
	cart.reduce((maxItem, currentItem) => {
		return currentItem.price > maxItem.price ? currentItem : maxItem;
	}, cart[0]);
};
export default getHighestPriceItem;

// mayowa
// github
//  Umar kabir
// brige the gap
// talk to someOne
// what are trending
// present your idea / translate, convince the audience

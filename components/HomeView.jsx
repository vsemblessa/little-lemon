import { useMenu } from "../state/MenuState";
import { useSession } from "../state/SessionState";
import { useOrder } from "../state/OrderState";

import {
	View,
	Text,
	SafeAreaView,
	Image,
	StyleSheet,
	ScrollView,
	FlatList,
} from "react-native";
import * as Haptics from "expo-haptics";

import Header from "./Header";
import Input from "./Input";
import Button from "./Button";
import { MenuRowList, MenuRowItem } from "./MenuRowList";

import {
	API_ENDPOINTS,
	COLORS,
	ORDER_STATES,
	brandFont,
} from "../utils/config";
import { Pressable } from "react-native";

const HomeView = ({ navigation }) => {
	const { menu, isLoading, categories } = useMenu();
	const {
		order,
		getTotalOrderPrice,
		getTotalSelectedProductQty,
		confirmOrder,
	} = useOrder();

	if (isLoading || !menu) return <Text>Loading menu...</Text>;

	return (
		<SafeAreaView>
			<Header />
			<ScrollView
				keyboardDismissMode="interactive"
				style={{ height: "100%" }}
			>
				<HomeBanner />
				<CategoryList categories={categories} />
				<MenuList menuData={menu} />
			</ScrollView>
			<View
				style={{
					position: "fixed",
					bottom: "13%",
					paddingHorizontal: 20,
				}}
			>
				{order && order?.products?.length > 0 && (
					<Button
						onPress={() => {
							if (
								order.state ===
								(ORDER_STATES.COOKING || ORDER_STATES.DELIVERED)
							)
								confirmOrder();
							navigation?.navigate("Order");
						}}
						text={
							order?.state === ORDER_STATES.PENDING
								? `${getTotalSelectedProductQty()} products for $${getTotalOrderPrice().toFixed(
										2
								  )}`
								: `Press to see your order`
						}
					></Button>
				)}
			</View>
		</SafeAreaView>
	);
};

const MenuList = ({ menuData }) => {
	const { order } = useOrder();
	return (
		<View
			style={[
				{ marginTop: 20 },
				order ? { marginBottom: 160 } : { marginBottom: 60 },
			]}
		>
			<FlatList
				data={menuData}
				keyExtractor={(item, index) => index}
				renderItem={({ item }) => <MenuItem {...item} />}
			></FlatList>
		</View>
	);
};

const MenuItem = ({ id, name, price, description, image, category }) => {
	const { addItemToOrder, order, getSelectedProducts, removeItemFromOrder } =
		useOrder();

	const selectedProduct = getSelectedProducts()?.filter(
		(product) => product.id === id
	);

	const handleAdd = () => {
		Haptics.selectionAsync();
		addItemToOrder({
			id,
			name,
			price,
			description,
			image,
			category,
		});
	};

	const handleRemove = () => {
		Haptics.selectionAsync();
		removeItemFromOrder(selectedProduct?.[0]?.id);
	};

	const MenuItemOrderButton = ({ text, onPress, style }) => {
		return (
			<Pressable
				onPress={onPress}
				style={[styles.menuItemOrderButtonContainer, style]}
			>
				<Text style={styles.menuOrderButtonText}>{text}</Text>
			</Pressable>
		);
	};

	return (
		<View style={styles.menuItemContainer}>
			<View>
				<Image
					resizeMode="stretch"
					style={styles.menuItemImage}
					source={{
						uri: image ? API_ENDPOINTS.MENU_IMAGE(image) : null,
					}}
				></Image>
			</View>

			<View style={styles.menuItemBodyWrapper}>
				<Text style={styles.menuItemProductNameText}>{name}</Text>

				<Text numberOfLines={2} style={styles.menuItemDescriptionText}>
					{description}
				</Text>

				<View style={styles.menuItemBottomWrapper}>
					<Text style={styles.menuItemPriceText}>${price}</Text>
					{selectedProduct?.length > 0 ? (
						<View style={styles.menuOrderButtonsWrapper}>
							<MenuItemOrderButton
								text={"-"}
								onPress={handleRemove}
							/>

							<Text
								style={{
									minWidth: 40,
									textAlign: "center",
									fontFamily: brandFont(),
									fontSize: 20,
								}}
							>
								{selectedProduct?.[0]?.qty}
							</Text>

							<MenuItemOrderButton
								text={"+"}
								onPress={handleAdd}
							/>
						</View>
					) : (
						<View>
							<MenuItemOrderButton
								text={"Add"}
								onPress={handleAdd}
							/>
						</View>
					)}
				</View>
			</View>
		</View>
	);
};

const HomeBanner = () => {
	const { query, setQuery } = useMenu();
	return (
		<View style={styles.container}>
			<Text style={styles.heroHeading}>Little Lemon</Text>

			<View style={styles.heroTextContainer}>
				<View style={{ maxWidth: "55%" }}>
					<Text style={styles.restaurantLocationText}>Chicago</Text>
					<Text style={styles.restaurantDescriptionText}>
						We are family-owned Mediterranean restaurant, focused on
						traditional recipes served with a modern twist.
					</Text>
				</View>
				<View style={styles.heroImageContainer}>
					<Image
						resizeMode="cover"
						style={styles.heroImage}
						source={require("../assets/hero_image.png")}
					></Image>
				</View>
			</View>

			<MenuRowList style={{ marginTop: 20 }}>
				<MenuRowItem
					style={{ paddingRight: 10 }}
					leftChild={
						<Input
							value={query}
							onValueChange={setQuery}
							placeholder={"Search dishes"}
							clearButtonMode="always"
						/>
					}
				/>
			</MenuRowList>
		</View>
	);
};

const CategoryList = ({ categories }) => {
	const { selectedCategories, onCategoryPress } = useMenu();

	const CategoryItem = ({ category, onPress, isSelected, style }) => {
		return (
			<Pressable
				onPress={() => {
					Haptics.selectionAsync();
					onPress(category);
				}}
				style={[
					styles.categoryItem,
					isSelected
						? styles.categoryItemSelected
						: styles.categortyItemNotSelected,
					style,
				]}
			>
				<Text
					style={
						isSelected
							? styles.categoryItemTextSelected
							: styles.categoryItemText
					}
				>
					{category}
				</Text>
			</Pressable>
		);
	};

	return (
		<View style={styles.categoryListContainer}>
			<Text style={styles.categoryListHeading}>Order for delivery</Text>
			<FlatList
				showsHorizontalScrollIndicator={false}
				style={styles.categoryList}
				horizontal
				data={categories}
				keyExtractor={({ item }) => item}
				renderItem={({ item, index }) => (
					<CategoryItem
						style={
							index === categories.length - 1
								? { marginRight: 40 }
								: null
						}
						category={item}
						onPress={onCategoryPress}
						isSelected={selectedCategories?.includes(item)}
					/>
				)}
			></FlatList>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.brand.green,
		padding: 20,
		position: "relative",
	},
	heroTextContainer: {
		flexDirection: "row",
		gap: 10,
	},
	heroHeading: {
		fontFamily: brandFont("heading"),
		fontSize: 65,
		lineHeight: 65,
		color: COLORS.brand.yellow,
	},
	heroImage: {
		borderRadius: 10,
		width: 153.125,
		height: 175,
	},
	heroImageContainer: { marginLeft: "auto" },
	restaurantLocationText: {
		fontFamily: brandFont("heading"),
		fontSize: 35,
		lineHeight: 35,
		color: "white",
		marginBottom: 10,
	},
	restaurantDescriptionText: {
		fontFamily: brandFont(),
		fontSize: 16,
		color: "white",
	},
	categoryListContainer: {
		borderBottomColor: "rgba(84,84,88,0.25)",
		borderBottomWidth: 0.33,
		paddingBottom: 20,
	},
	categoryListHeading: {
		padding: 20,
		fontWeight: "600",
		fontSize: 23,
	},
	categoryList: {
		paddingLeft: 20,
		gap: 20,
	},
	categoryItem: {
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 12,
		marginRight: 10,
	},
	categoryItemText: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.brand.green,
	},
	categoryItemTextSelected: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.brand.lightHighlight,
	},
	categortyItemNotSelected: {
		backgroundColor: COLORS.brand.neutralHighlight,
	},
	categoryItemSelected: {
		backgroundColor: COLORS.brand.green,
	},
	menuItemContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 20,
		marginHorizontal: 20,
		borderBottomColor: "rgba(84,84,88,0.25)",
		borderBottomWidth: 0.33,
	},
	menuItemOrderButtonContainer: {
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 10,
		backgroundColor: COLORS.brand.neutralHighlight,
		alignItems: "center",
		justifyContent: "center",
	},
	menuOrderButtonsWrapper: {
		flexDirection: "row",
		alignItems: "center",
	},
	menuOrderButtonText: {
		fontWeight: "600",
		color: COLORS.brand.green,
		fontSize: 16,
	},
	menuItemPriceText: {
		fontSize: 23,
		color: COLORS.brand.green,
		fontFamily: brandFont(),
	},
	menuItemBottomWrapper: {
		marginTop: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	menuItemDescriptionText: {
		color: COLORS.brand.green,
		fontFamily: brandFont(),
	},
	menuItemProductNameText: {
		fontSize: 16,
		color: "black",
		fontWeight: "600",
		marginBottom: 13,
	},
	menuItemImage: { height: 100, width: 100, borderRadius: 5 },
	menuItemBodyWrapper: { marginLeft: 16, flex: 1 },
});

export default HomeView;

// Doc Examples
import AccountDetails from './account/details';
import AccountLogin from './account/login';
import AccountOrdersHistory from './account/orders';
import AccountRegister from './account/register';
import ResetPassword from './account/reset-password';
import AccountTest from './account/test';
import AddDeliveryAddressForm from './adelco/addDeliveryAddress';
import AdelcoCart from './adelco/cart';
import AdelcoCheckout from './adelco/checkout';
import AdelcoBanner from './adelco/content/Banner';
import AdelcoBannerGrid from './adelco/content/BannerGrid';
import AdelcoTextBanner from './adelco/content/TextBanner';
import AdelcoBannerCTA from './adelco/content/BannerCTA/BannerCTA';
import FooterTastic from './adelco/footer';
import AdelcoHeader from './adelco/header';
import OrderConfirmationTastic from './adelco/orderConfirmation';
import CategoryCarouselTastic from './adelco/products/CategoryCarousel';
import ProductDetail from './adelco/products/product-details';
import AdelcoProductList from './adelco/products/ProductList';
import RegisterTastic from './adelco/Register';
import ResetPasswordTastic from './adelco/resetPassword';
import SimpleHeaderTastic from './adelco/SimpleHeader';
import FreeDeliveryTastic from './adelco/FreeDelivery';
import Cart from './cart';
import Checkout from './checkout';
import ThankYou from './checkout/thank-you';
import Markdown from './content/markdown';
import Spacer from './content/spacer';
import Tile from './content/tile';
import ContentfulBlogTastic from './contentful-blog';
import HelloWorld from './doc-examples/hello-world';
import SimpleButton from './doc-examples/simple-button';
import StarWarsCharacterFilter from './doc-examples/star-wars/character-filter';
import StarWarsCharacterSearch from './doc-examples/star-wars/character-search';
import StarWarsOpeningCrawl from './doc-examples/star-wars/movies';
import TextTastic from './adelco/content/Text';
//import ContentfulBlog from './doc-examples/contentful/blog';

import Footer from './footer';
import Header from './header';
import Newsletter from './newsletter';
import NotFound from './not-found';
import ProductDetails from './products/details';
import ProductList from './products/product-list';
import SimilarProducts from './products/similar-products';
import ProductSlider from './products/slider';
import Showcase from './showcase';
import Wishlist from './wishlist';
import RequestTastic from './adelco/Request';

export const tastics = {
  'adelco/ui/products/product-list': AdelcoProductList,
  'adelco/ui/header': AdelcoHeader,
  'adelco/ui/simple-header': SimpleHeaderTastic,
  'adelco/ui/products/category-carousel': CategoryCarouselTastic,
  'adelco/ui/product-details': ProductDetail,
  'adelco/ui/order-confirmation': OrderConfirmationTastic,
  'adelco/ui/footer': FooterTastic,
  'adelco/ui/cart': AdelcoCart,
  'adelco/ui/checkout': AdelcoCheckout,
  'adelco/ui/banner': AdelcoBanner,
  'adelco/ui/bannergrid': AdelcoBannerGrid,
  'adelco/ui/textbanner': AdelcoTextBanner,
  'adelco/ui/banner-cta': AdelcoBannerCTA,
  'adelco/ui/register': RegisterTastic,
  'adelco/ui/request': RequestTastic,
  'adelco/ui/reset-password': ResetPasswordTastic,
  'adelco/ui/add-delivery-address': AddDeliveryAddressForm,
  'adelco/ui/minimum-delivery-amount': FreeDeliveryTastic,
  'adelco/ui/text': TextTastic,
  // Doc Examples
  'example/simple-button': SimpleButton,
  'example/hello-world': HelloWorld,
  'example/star-wars/movie': StarWarsOpeningCrawl,
  'example/star-wars/character-search': StarWarsCharacterSearch,
  'example/star-wars/character-filter': StarWarsCharacterFilter,
  //'contentful/blog': ContentfulBlog,

  'commercetools/ui/checkout': Checkout,
  'commercetools/ui/thank-you': ThankYou,
  'commercetools/ui/cart': Cart,
  'commercetools/ui/footer': Footer,
  'commercetools/ui/header': Header,
  'commercetools/ui/content/tile': Tile,
  'commercetools/ui/content/spacer': Spacer,
  'commercetools/ui/content/showcase': Showcase,
  'commercetools/ui/content/markdown': Markdown,
  'commercetools/ui/content/newsletter': Newsletter,
  'commercetools/ui/products/details': ProductDetails,
  'commercetools/ui/products/product-list': ProductList,
  'commercetools/ui/products/slider': ProductSlider,
  'commercetools/ui/products/similar-products': SimilarProducts,
  'commercetools/ui/wishlist': Wishlist,
  'commercetools/ui/account/test': AccountTest,
  'commercetools/ui/account/details': AccountDetails,
  'commercetools/ui/account/login': AccountLogin,
  'commercetools/ui/account/register': AccountRegister,
  'commercetools/ui/account/orders': AccountOrdersHistory,
  'commercetools/ui/account/reset-password': ResetPassword,
  'commercetools/ui/content/contentful/blog': ContentfulBlogTastic,
  default: NotFound
};

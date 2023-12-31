// Doc Examples
import AccountDetails from './account/details';
import AccountLogin from './account/login';
import AccountOrdersHistory from './account/orders';
import AccountRegister from './account/register';
import ResetPassword from './account/reset-password';
import AccountTest from './account/test';
import AdelcoCart from './adelco/cart';
import FooterTastic from './adelco/footer';
import AdelcoHeader from './adelco/header';
import CategoryCarouselTastic from './adelco/products/CategoryCarousel';
import ProductDetail from './adelco/products/product-details';
import AdelcoProductList from './adelco/products/ProductList';
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

export const tastics = {
  // Adelco
  'adelco/ui/products/product-list': AdelcoProductList,
  'adelco/ui/header': AdelcoHeader,
  'adelco/ui/products/category-carousel': CategoryCarouselTastic,
  'adelco/ui/product-details': ProductDetail,
  'adelco/ui/footer': FooterTastic,
  'adelco/ui/cart': AdelcoCart,

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
  default: NotFound,
};

import Style from '@common/StyledComponents';
import Images from '@images/images.js';
import CustomComponents from '@common/CustomComponents';
import FoodProperties from './components/FoodProperties';
import Ingredients from './components/Ingredients';

const FoodDetails = () => {
  return (
    <Style.ScrollView>
      <CustomComponents.Header
        overlay={true}
        title="Sezar salad"
        titleColor="text-white"
      />
      <Images.FoodDetailsHeader />
      <FoodProperties />
      <Ingredients />
    </Style.ScrollView>
  );
};

export default FoodDetails;

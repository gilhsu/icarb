import React, { useState } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Button, Image, Alert } from "react-bootstrap";
import { useHistory } from "react-router";
import { chooseOption, resetBuilder, addToCart } from "../modules/pizzas";
import SubtotalContainer from "./containers/SubtotalContainer";
import OptionBlock from "./tiles/OptionBlock";
import OptionCheckBlock from "./tiles/OptionCheckBlock";
import ResetModal from "./ResetModal";

const Order = ({
  pizzaSizes,
  crustTypes,
  pizzaStyles,
  extraToppings,
  chooseOption,
  subtotalItems,
  mdSizeSelected,
  resetBuilder,
  addToCart,
  cart,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();
  const cheesePizzas = pizzaStyles.filter((pizza) => pizza.type === "cheese");
  const vegPizzas = pizzaStyles.filter((pizza) => pizza.type === "veg");
  const meatPizzas = pizzaStyles.filter((pizza) => pizza.type === "meat");

  const handleContinue = () => {
    addToCart();
    history.push("/icarb/checkout");
  };

  const handleBuildAnother = () => {
    addToCart();
    resetBuilder();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  let pizzaImageURL = "/icarb/images/cheese.jpeg";
  subtotalItems.forEach((item) => {
    if (item.category === "Style") {
      pizzaImageURL = `/icarb/images/${item.img}`;
    }
  });

  const blockSelected = (array, category) => {
    const items = array.filter((item) => item.category === category);
    if (items.length > 0) {
      return true;
    }
    return false;
  };

  const sizeSelected = blockSelected(subtotalItems, "Size");
  const crustSelected = blockSelected(subtotalItems, "Crust");
  const styleSelected = blockSelected(subtotalItems, "Style");

  const extraToppingTitle = mdSizeSelected
    ? "Choose extra toppings. +$1.50 each"
    : "Choose extra toppings. +$2.50 each";

  const pizzaStyleClassName = crustSelected
    ? "my-3 fw-5"
    : "my-3 fw-5 disabled-block";

  const checkoutDisabled = subtotalItems.length > 2 ? false : true;

  return (
    <Container className="mt-5 mx-auto">
      {showAlert && (
        <Alert variant="success">Pizza was successfully added to cart.</Alert>
      )}
      <Row>
        <Col md={6}>
          <Image className="preview-img mb-3" src={pizzaImageURL} />
          <SubtotalContainer
            items={subtotalItems}
            mdSizeSelected={mdSizeSelected}
          />
          <div className="line-below">
            <Button
              className="mb-3"
              block={true}
              disabled={checkoutDisabled}
              onClick={handleContinue}
            >
              Continue
            </Button>
            {cart.length === 0 && (
              <Button
                className="mb-3"
                variant="outline-info"
                block={true}
                disabled={checkoutDisabled}
                onClick={handleBuildAnother}
              >
                Add To Cart
              </Button>
            )}
            {cart.length > 0 && (
              <Row>
                <Col md={6} className="pr-2">
                  <Button
                    className="mb-3"
                    variant="outline-info"
                    block={true}
                    disabled={checkoutDisabled}
                    onClick={handleBuildAnother}
                  >
                    Add To Cart
                  </Button>
                </Col>
                <Col md={6} className="pl-2">
                  <Button
                    className="mb-3"
                    variant="outline-secondary"
                    block={true}
                    onClick={() => history.push("/icarb/checkout")}
                  >
                    Go To Checkout
                  </Button>
                </Col>
              </Row>
            )}
          </div>
          <Button
            variant="outline-danger"
            block={true}
            onClick={() => setModalShow(true)}
          >
            Reset
          </Button>
        </Col>
        <Col md={6} className="order-options-column">
          <div className="fs-2 fw-5">
            Start Order{" "}
            <span role="img" aria-label="check">
              ✅
            </span>
          </div>
          <div className="mb-5">
            Select from our list of gourmet pies or build your own.
          </div>
          <OptionBlock
            title="Choose your size."
            options={pizzaSizes}
            sizeBlock={true}
            selectFunction={chooseOption}
            prevBlockSelected={true}
          />
          <OptionBlock
            title="Choose your crust."
            options={crustTypes}
            selectFunction={chooseOption}
            mdSizeSelected={mdSizeSelected}
            prevBlockSelected={sizeSelected}
          />
          <div className="option-block">
            <div className={pizzaStyleClassName}>
              Choose from our House Specials.
            </div>
            <OptionBlock
              title="Cheese"
              subOptionBlock={true}
              options={cheesePizzas}
              selectFunction={chooseOption}
              mdSizeSelected={mdSizeSelected}
              prevBlockSelected={crustSelected}
            />
            <OptionBlock
              title="Veggie"
              subOptionBlock={true}
              options={vegPizzas}
              selectFunction={chooseOption}
              mdSizeSelected={mdSizeSelected}
              prevBlockSelected={crustSelected}
            />
            <OptionBlock
              title="Meat"
              subOptionBlock={true}
              options={meatPizzas}
              selectFunction={chooseOption}
              mdSizeSelected={mdSizeSelected}
              prevBlockSelected={crustSelected}
            />
          </div>
          <OptionCheckBlock
            title={extraToppingTitle}
            options={extraToppings}
            selectFunction={chooseOption}
            prevBlockSelected={styleSelected}
          />
        </Col>
      </Row>
      <ResetModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        resetBuilder={() => resetBuilder()}
      />
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    pizzaSizes: state.pizzas.pizzaOptions.filter((option) => {
      return option.category === "Size";
    }),
    crustTypes: state.pizzas.pizzaOptions.filter((option) => {
      return option.category === "Crust";
    }),
    pizzaStyles: state.pizzas.pizzaOptions.filter((option) => {
      return option.category === "Style";
    }),
    extraToppings: state.pizzas.pizzaOptions.filter((option) => {
      return option.category === "Extra Topping";
    }),
    mdSizeSelected: state.pizzas.mdSizeSelected,
    subtotalItems: state.pizzas.subtotalItems,
    cart: state.pizzas.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    chooseOption: (category, toppingId) =>
      dispatch(chooseOption(category, toppingId)),
    resetBuilder: () => dispatch(resetBuilder()),
    addToCart: () => dispatch(addToCart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);

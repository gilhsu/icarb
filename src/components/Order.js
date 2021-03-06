import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Alert,
  Popover,
  Overlay,
} from "react-bootstrap";
import { withRouter, useParams } from "react-router";
import {
  chooseOption,
  resetBuilder,
  addToCart,
  setShowLoader,
  setShowLeaveBuilderModal,
} from "../modules/pizzas";
import { delay } from "../helpers/helperFunctions";
import SubtotalContainer from "./containers/SubtotalContainer";
import OptionBlock from "./tiles/OptionBlock";
import OptionCheckBlock from "./tiles/OptionCheckBlock";
import ResetModal from "./modals/ResetModal";
import PageLoader from "./PageLoader";
import LeaveBuilderModal from "./modals/LeaveBuilderModal";

const Order = ({
  history,
  location,
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
  showLoader,
  setShowLoader,
  showLeaveBuilder,
  setShowLeaveBuilderModal,
  afterLeaveBuilderPath,
}) => {
  // for checkout tooltip
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const [modalShow, setModalShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { id: urlId } = useParams();
  const cheesePizzas = pizzaStyles.filter((pizza) => pizza.type === "cheese");
  const vegPizzas = pizzaStyles.filter((pizza) => pizza.type === "veg");
  const meatPizzas = pizzaStyles.filter((pizza) => pizza.type === "meat");

  const checkoutDisabled = subtotalItems.length > 2 ? false : true;

  const handleShowTooltip = (event) => {
    if (checkoutDisabled) {
      setShow(true);
      setTarget(event.target);
    }
  };

  const handleHideTooltip = () => {
    setShow(false);
  };

  const handleContinue = async () => {
    setShowLoader(true);
    addToCart(parseInt(urlId));
    resetBuilder();
    await delay(1000);
    setShowLoader(false);
    history.push("/icarb/checkout");
  };

  const handleBuildAnother = async () => {
    setShowLoader(true);
    addToCart(parseInt(urlId));
    resetBuilder();
    await delay(500);
    setShowLoader(false);
    history.push("/icarb/pizza/new");
    setShowAlert(true);
  };

  const handleReset = async () => {
    setShowLoader(true);
    resetBuilder();
    await delay(500);
    setShowLoader(false);
  };

  const handleGoToCheckout = async () => {
    if (
      location.pathname.includes("/icarb/pizza") &&
      subtotalItems.length > 0
    ) {
      setShowLeaveBuilderModal(true, "/icarb/checkout");
    } else {
      history.push("/icarb/checkout");
    }
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

  if (showLoader) {
    return <PageLoader />;
  }

  const buttonClassName = checkoutDisabled ? "mb-3 overlay-button" : "mb-3";

  const CheckoutTooltip = () => (
    <Overlay
      show={show}
      target={target}
      placement="bottom"
      container={ref.current}
      containerPadding={20}
    >
      <Popover id="popover-contained">
        <Popover.Title as="h3">Pizza Builder Incomplete</Popover.Title>
        <Popover.Content>
          Must select <strong>Size, Crust Style and Toppings</strong> to
          continue.
        </Popover.Content>
      </Popover>
    </Overlay>
  );

  return (
    <Container className="mt-5 mx-auto">
      {showAlert && (
        <Alert
          variant="success"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          Pizza was successfully added to cart.
        </Alert>
      )}
      <Row>
        <Col md={6}>
          <Image className="preview-img mb-3" src={pizzaImageURL} />
          <SubtotalContainer
            items={subtotalItems}
            mdSizeSelected={mdSizeSelected}
          />
          <div className="line-below">
            <span
              onMouseOver={handleShowTooltip}
              onMouseLeave={handleHideTooltip}
            >
              <Button
                className={buttonClassName}
                block={true}
                disabled={checkoutDisabled}
                onClick={handleContinue}
              >
                Continue
              </Button>
            </span>

            {cart.length === 0 && (
              <span
                onMouseOver={handleShowTooltip}
                onMouseLeave={handleHideTooltip}
              >
                <Button
                  className={buttonClassName}
                  variant="outline-info"
                  block={true}
                  disabled={checkoutDisabled}
                  onClick={handleBuildAnother}
                >
                  Add To Cart
                </Button>
              </span>
            )}
            {cart.length > 0 && (
              <Row>
                <Col md={6} className="pr-2">
                  <span
                    onMouseOver={handleShowTooltip}
                    onMouseLeave={handleHideTooltip}
                  >
                    <Button
                      className={buttonClassName}
                      variant="outline-info"
                      block={true}
                      disabled={checkoutDisabled}
                      onClick={handleBuildAnother}
                    >
                      Add To Cart
                    </Button>
                  </span>
                </Col>
                <Col md={6} className="pl-2">
                  <Button
                    className="mb-3"
                    variant="outline-secondary"
                    block={true}
                    onClick={handleGoToCheckout}
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
              Choose your topping style.
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
        handleReset={handleReset}
      />
      <LeaveBuilderModal
        show={showLeaveBuilder}
        onHide={() => setShowLeaveBuilderModal(false)}
        setShowLoader={setShowLoader}
        resetBuilder={resetBuilder}
        afterLeaveBuilderPath={afterLeaveBuilderPath}
      />
      <CheckoutTooltip />
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
    showLoader: state.pizzas.showLoader,
    showLeaveBuilder: state.pizzas.showLeaveBuilder,
    afterLeaveBuilderPath: state.pizzas.afterLeaveBuilderPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    chooseOption: (category, toppingId) =>
      dispatch(chooseOption(category, toppingId)),
    resetBuilder: () => dispatch(resetBuilder()),
    addToCart: (id) => dispatch(addToCart(id)),
    setShowLoader: (boolean) => dispatch(setShowLoader(boolean)),
    setShowLeaveBuilderModal: (boolean, path) =>
      dispatch(setShowLeaveBuilderModal(boolean, path)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Order));

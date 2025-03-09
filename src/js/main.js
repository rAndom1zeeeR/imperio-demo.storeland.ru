console.time("start time");

/**
 * Функция Добавления пробела между разрядами.
 * Используется в функциях: StickerSales, handleQuantityProductView, CartMinSum, handleDeliveryPrice
 */
function getMoneyFormat(str) {
  return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
}

/**
 * Функция определения ширины экрана пользователя.
 * Используется в функциях: Mainnav
 */
function getClientWidth() {
  // TODO Разобрать функцию
  return document.compatMode == "CSS1Compat" && !window.opera ? document.documentElement.clientWidth : document.body.clientWidth;
}

/**
 * Функция формирования ссылки с атрибутом only_body.
 * Используется в функциях: CartClear, CartRemove, handleAddtoModClick
 */
function getUrlBody(url) {
  return url + (url.indexOf("?") ? "&" : "?") + "only_body=1";
}

/**
 * Функция получения HTML страницы по ссылке.
 * Используется в функциях: CartClear, CartRemove, handleAddtoModClick, handleCartRemoveItem, handleCartClear, handleCartOrderClose
 */
async function getHtmlFromUrl(url) {
  // console.log('[DEBUG]: url', url);
  return await fetch(url)
    // Получаем ответ
    .then((response) => response.text())
    // Преобразуем в html
    .then((text) => {
      const parser = new DOMParser();
      const html = parser.parseFromString(text, "text/html");
      // console.log('[DEBUG]: html', html);
      return html;
    })
    // Если получили ошибку
    .catch((error) => console.error(error));
}

/**
 * Функция Отправления запроса и получения HTML страницы по ссылке.
 * Используется в функциях: handleAddtoCartClick, AddtoOrder, handleAddtoOrderClick, handleCartQtyInput, handleCartOrderStart,
 * handleCouponSubmit, Autorization
 */
async function getHtmlFromPost(url, form) {
  return await fetch(url, {
    method: "POST",
    body: form,
  })
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const html = parser.parseFromString(data, "text/html");
      return html;
    })
    .catch((error) => console.error(error));
}

/**
 * Функция Отправления запроса и получения JSON по ссылке.
 * Используется в функциях:
 */
async function getJsonFromPost(url, form) {
  return await fetch(url, {
    method: "POST",
    body: form,
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  // .catch((error) => console.error(error));
}

/**
 * Функция Изменения текста в слотах
 * Используется в функциях: VisibleItems
 */
function SlotText(element) {
  const slot = element.querySelector("[slot]");
  if (!slot) return false;
  const hideText = slot.getAttribute("slot");
  const showText = slot.textContent.trim();
  // Обновляем данные
  slot.textContent = hideText;
  slot.setAttribute("slot", showText);
}

/**
 * Функция определния области нажания на контент
 * Используется в функциях: Mainnav, Opener, на всех страницах.
 * Использует функции:
 */
function OverlayCloser(event, selector, handler) {
  const content = document.querySelector(selector);
  if (event.target.closest(selector) !== content) {
    content.classList.remove("is-opened");
    document.body.removeEventListener("click", handler);
  } else {
    content.classList.add("is-opened");
  }
}

/**
 * Функция закрытия контента вне области нажатия
 * Используется в функциях: Mainnav, Opener, на всех страницах.
 * Использует функции:
 */
function OverlayOpener(content, handler) {
  content.classList.toggle("is-opened");
  if (content.classList.contains("is-opened")) {
    document.body.addEventListener("click", handler);
  } else {
    document.body.removeEventListener("click", handler);
  }
}

/**
 * Уведомления.
 * Используется в функциях: handleAddtoPost, handleAddtoCartUpdate, handleValueMax
 */
function СreateNoty(type, content) {
  // console.log("[DEBUG]: type", type);
  // console.log("[DEBUG]: content", content);
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    showCloseButton: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: type,
    html: content,
  });
}

/**
 * Функция отображения и обработки диалоговых окон на странице.
 * Используется в функциях: handleAddtoModOpen, handleCartRemoveItem, на всех страницах.
 */
function Dialogs(doc = document) {
  const dialogs = doc.querySelectorAll("[data-dialog]");
  if (dialogs.length === 0) {
    console.info("[INFO]: 'Модальные окна' не найдены на странице", dialogs);
    return;
  }

  dialogs.forEach((dialog) => {
    const dialogName = dialog.getAttribute("data-dialog");
    const dialogContent = document.querySelector(dialogName);
    // console.log("[DEBUG]: dialogName", dialogName);
    // console.log("[DEBUG]: dialogContent", dialogContent);
    if (!dialogContent) {
      console.info("[INFO]: 'Модальное окно' не найдено", dialogContent);
      return;
    }

    dialog.addEventListener("click", (event) => {
      event.preventDefault();
      dialogContent.showModal();
      document.body.classList.add("is-bodylock");
      dialog.classList.add("is-active");
    });
    dialogContent.addEventListener("close", () => {
      document.body.classList.remove("is-bodylock");
      dialog.classList.remove("is-active");
    });
    dialogContent.addEventListener("click", (event) => {
      const dialogTarget = event.currentTarget;
      const isClickedOnBackDrop = event.target === dialogTarget;
      if (isClickedOnBackDrop) {
        dialogTarget.close();
      }
    });

    const dialogCloser = DialogsCloser(dialogContent);
    if (dialogCloser) {
      dialogCloser.addEventListener("click", () => {
        dialogContent.close();
      });
    }
  });
}

/**
 * Обработать диалоговое окно.
 * Используется в функциях: handleAddtoModOpen, handleAddtoOrderOpen
 */
// function DialogsHandler(dialog, dialogClose, show = false) {
//   if (show) {
//     dialog.show();
//   } else {
//     dialog.showModal();
//   }
//   document.body.classList.add("is-bodylock");

//   dialog.addEventListener("close", () => {
//     document.body.classList.remove("is-bodylock");
//     dialog.remove();
//   });

//   dialog.addEventListener("click", (event) => {
//     const dialogTarget = event.currentTarget;
//     const isClickedOnBackDrop = event.target === dialogTarget;
//     if (isClickedOnBackDrop) {
//       dialogTarget.close();
//       dialog.remove();
//     }
//   });

//   dialogClose.addEventListener("click", () => {
//     dialog.close();
//     dialog.remove();
//   });
// }

/**
 * Создать диалоговое окно.
 * Используется в функциях: handleAddtoModOpen, handleAddtoOrderOpen
 */
// function DialogsCreate(id, label, content) {
//   const dialog = document.createElement("div");
//   dialog.setAttribute("id", id);
//   dialog.setAttribute("aria-label", label);
//   dialog.setAttribute("aria-modal", "true");
//   dialog.setAttribute("role", "dialog");
//   dialog.append(content);
//   document.body.append(dialog);
//   return dialog;
// }

/**
 * Создать кнопку закрыть диалоговое окно.
 * Используется в функциях: Dialogs, handleAddtoModOpen, handleAddtoOrderOpen
 */
function DialogsCloser(dialog) {
  // console.log("[DEBUG]: createDialogCloser", dialog);
  if (dialog.querySelector(".dialog__close")) return;
  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.classList.add("dialog__close", "button-icon");
  button.setAttribute("aria-label", "Закрыть модальное окно");
  button.setAttribute("data-dialog-close", "");
  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="18" height="18" aria-hidden="true"><path d="m568.571 512.003 443.715-443.715c15.622-15.622 15.622-40.95 0-56.57s-40.954-15.622-56.57 0L511.999 455.433 68.286 11.718c-15.622-15.622-40.95-15.622-56.57 0s-15.622 40.95 0 56.57l443.713 443.713L11.716 955.716c-15.622 15.622-15.622 40.949 0 56.57a39.925 39.925 0 0 0 12.974 8.681 39.939 39.939 0 0 0 15.312 3.032 39.939 39.939 0 0 0 15.312-3.032 39.94 39.94 0 0 0 12.974-8.681l443.711-443.713 443.711 443.713c7.811 7.811 18.051 11.713 28.285 11.713 10.24 0 20.474-3.903 28.291-11.713 15.622-15.622 15.622-40.949 0-56.57L568.571 512.003z"/></svg>`;
  dialog.append(button);
  return button;
}

/**
 * Функция показать пароль.
 * Используется в функциях: handleAddtoOrderOpen, handleCartOrder, handleCartOrderStart, на всех страницах.
 * Использует функции: ValidateRequired
 */
function Passwords() {
  const passwords = document.querySelectorAll(".password");
  // console.log("[DEBUG]: Поле пароля не найдено", passwords);
  if (passwords.length === 0) return;

  passwords.forEach((password) => {
    const button = password.querySelector("button");
    const input = password.querySelector("input");
    // console.log("[DEBUG]: password button", button);
    // console.log("[DEBUG]: password input", input);
    button.addEventListener("click", () => {
      // Если не ввели пароль
      if (input.value.length < 1) return;
      // Изменяем тип input поля с password на text
      const isPass = input.type === "password";
      input.type = isPass ? "text" : "password";
      // Добавляем активный класс
      button.setAttribute("aria-pressed", isPass);
    });

    // Действие при вводе в поле пароля
    input.addEventListener("keyup", function (event) {
      // console.log("[DEBUG]: Действие при вводе в поле пароля keyup", event);
      capslockHandler(event);
    });
  });

  // Показать ошибку.
  function capslockHandler(event) {
    const status = event.getModifierState && event.getModifierState("CapsLock");
    const caps = event.target.closest("form").querySelector(".capslock");
    status ? caps.removeAttribute("hidden") : caps.setAttribute("hidden", "");

    console.log("[DEBUG]: capslockHandler status", status);
    console.log("[DEBUG]: capslockHandler caps", caps);
    return status;
  }

  // Зарегистрироваться
  const register = document.getElementById("want_register");
  if (!register) return;

  register.addEventListener("change", (event) => {
    const form = event.target.closest("form");
    const input = form.querySelector(".password__input");
    const email = form.querySelector("input[type='email']");
    const capslock = form.querySelector(".capslock");
    // console.log("event.currentTarget.checked", event.currentTarget.checked);
    // console.log("capslock", capslock);
    if (event.currentTarget.checked) {
      event.currentTarget.checked = true;
      input.parentElement.removeAttribute("hidden");
      email.setAttribute("required", "");
      input.setAttribute("required", "");
    } else {
      event.currentTarget.checked = false;
      input.parentElement.setAttribute("hidden", "");
      capslock.removeAttribute("hidden");
      email.removeAttribute("required");
      email.classList.remove("is-error");
      input.removeAttribute("required");
      input.classList.remove("is-error");
    }
    if (capslockHandler(event)) {
      capslock.removeAttribute("hidden");
    } else {
      capslock.setAttribute("hidden", "");
    }
    ValidateRequired(form);
  });
}

/**
 * Функция переноса пунктов меню.
 * Используется в функциях: на всех страницах.
 * Использует функции: getClientWidth
 */
function Mainnav(selector = document) {
  const mainnav = selector.querySelector(".mainnav");
  const mainnavList = mainnav.querySelector(".mainnav__list");
  const mainnavDropdown = mainnav.querySelector(".mainnav__dropdown");
  const mainnavItems = mainnav.querySelectorAll(".mainnav__item");
  const mainnavMore = mainnav.querySelector(".mainnav__item--more");

  function mainnavItemsHandle() {
    if (getClientWidth() < 1024) return;
    let mainnavItemsWidth = 0;
    // console.log("[DEBUG]: mainnavItemsWidth11", mainnavItemsWidth);
    mainnavItems.forEach((item) => {
      mainnavItemsWidth += item.clientWidth;
      // console.log("[DEBUG]: mainnavItemsWidth", mainnavItemsWidth);
      // console.log("[DEBUG]: mainnavList.clientWidth", mainnavList.clientWidth);
      // console.log("[DEBUG]: item", item.classList.contains("mainnav__item--more"));
      if (mainnavItemsWidth > mainnavList.clientWidth) {
        mainnavDropdown.append(item);
      } else {
        mainnavList.append(item);
      }
    });
  }

  mainnavItemsHandle();
  window.addEventListener("resize", mainnavItemsHandle);

  mainnavMore.addEventListener("click", (event) => {
    event.preventDefault();
    mainnavMore.classList.toggle("is-active");
    OverlayOpener(mainnav, handleOpened);
  });

  function handleOpened(event) {
    OverlayCloser(event, ".mainnav", handleOpened);
  }
}

/**
 * Функция добавления в Избранное/Сравнение.
 * Используется в функциях: handleAddtoModOpen, на всех страницах.
 */
function Addto(doc = document) {
  const compareButtons = doc.querySelectorAll(".add-compare");
  const favoritesButtons = doc.querySelectorAll(".add-favorites");
  if (compareButtons.length === 0 && favoritesButtons.length === 0) return;

  compareButtons.forEach((button) => {
    button.addEventListener("click", handleAddtoClick);
  });

  favoritesButtons.forEach((button) => {
    button.addEventListener("click", handleAddtoClick);
  });

  // Обработка клика
  function handleAddtoClick(event) {
    // console.log("[DEBUG]: handleAddtoClick event", event);
    event.preventDefault();
    const currentTarget = event.currentTarget;
    const goods_href = currentTarget.getAttribute("href");
    const formData = new FormData();
    formData.append("ajax_q", "1");

    // Отправка запроса
    getJsonFromPost(goods_href, formData)
      .then((data) => {
        // console.log("[DEBUG]: handleAddtoPost data", data);
        if (data.status === "ok") {
          СreateNoty("success", data.message);
          // console.log("[DEBUG]: data.status success", data.message);
          if (currentTarget.classList.contains("add-compare")) {
            handleAddtoLink(currentTarget, "compare", "сравнения");
            handleAddtoCount(data.compare_goods_count, ".compare");
          } else {
            handleAddtoLink(currentTarget, "favorites", "избранного");
            handleAddtoCount(data.favorites_goods_count, ".favorites");
          }
        } else {
          СreateNoty("error", data.message);
          // console.log("[DEBUG]: data.status error", data.message);
        }
      })
      .catch((error) => console.error(error));
  }

  // Обновление количества
  function handleAddtoCount(count, selector) {
    const elements = document.querySelectorAll(selector);
    // console.log("[DEBUG]: elements", elements);
    elements.forEach((element) => {
      const data = element.querySelector("data");
      count === 0 ? element.classList.add("is-empty") : element.classList.remove("is-empty");
      if (data) {
        data.value = count;
        data.innerHTML = count;
      }
    });
  }

  // Обновление ссылки
  function handleAddtoLink(currentTarget, type, label) {
    const form = currentTarget.closest("form");
    const name = form.querySelector("[name='form[goods_name]']").value;
    const id = form.querySelector("[name='form[goods_id]']").value;
    const modId = form.querySelector("[name='form[goods_mod_id]']").value;
    const urlAdd = `/${type}/add?id=${modId}`;
    const urlDelete = `/${type}/delete?id=${modId}`;
    const titleAdd = `Добавить «${name}» в список ${label} с другими товарами`;
    const titleDelete = `Убрать «${name}» из списка ${label} с другими товарами`;
    const addType = `.add-${type}`;
    if (currentTarget.classList.contains("is-added")) {
      handleAddtoLinkAdd(currentTarget, urlAdd, titleAdd);
      document.querySelectorAll(addType).forEach((element) => {
        const isEqualId = element.closest("form").querySelector("[name='form[goods_id]']").value === id;
        if (isEqualId) {
          handleAddtoLinkAdd(element, urlAdd, titleAdd);
        }
      });
    } else {
      handleAddtoLinkDelete(currentTarget, urlDelete, titleDelete);
      document.querySelectorAll(addType).forEach((element) => {
        const isEqualId = element.closest("form").querySelector("[name='form[goods_id]']").value === id;
        if (isEqualId) {
          handleAddtoLinkDelete(element, urlDelete, titleDelete);
        }
      });
    }
  }

  // Обновление ссылки добавления
  function handleAddtoLinkAdd(element, href, title) {
    element.classList.remove("is-added");
    element.setAttribute("href", href);
    element.setAttribute("title", title);
  }

  // Обновление ссылки удаления
  function handleAddtoLinkDelete(element, href, title) {
    element.classList.add("is-added");
    element.setAttribute("href", href);
    element.setAttribute("title", title);
  }
}

/**
 * Функция добавления товара в Корзину.
 * Используется в функциях: handleAddtoModOpen, на всех страницах.
 * Использует функции: CartRemove, CartClear, CartCountUppdate, CartDiscountUppdate, СreateNoty
 */
function AddtoCart(doc = document) {
  const buttons = doc.querySelectorAll(".add-cart");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", handleAddtoCartClick);
  });

  function handleAddtoCartClick(event) {
    event.preventDefault();
    // console.log("[DEBUG]: handleAddtoCartClick event", event);
    const currentTarget = event.currentTarget;
    const form = currentTarget.closest("form");
    const url = form.getAttribute("action");
    const formData = new FormData(form);
    formData.append("ajax_q", "1");
    // Отправка запроса
    getHtmlFromPost(url, formData).then((data) => {
      handleAddtoCartUpdate(data);
      // Запуск дополнительных функций
      CartRemove();
      CartClear();
    });
    // console.log("[DEBUG]: event", event.currentTarget);
    event.currentTarget.parentElement.classList.add("has-in-cart");
  }

  // Обновление корзины
  function handleAddtoCartUpdate(data) {
    console.log("[DEBUG]: handleAddtoCartUpdate data", data);
    const cartAddto = document.querySelector(".addto__cart");
    const cartAddtoData = data.querySelector("#newCartData");
    const cartSumDiscounts = document.querySelectorAll(".cart-discount");
    const cartSumDiscountData = data.querySelector(".cart-discount");
    const cartCounts = document.querySelectorAll(".cart-count");
    const cartCountDataValue = data.querySelector(".cart-count").value;
    // Обновление данных
    cartAddto.innerHTML = cartAddtoData.innerHTML;
    CartCountUppdate(cartCounts, cartCountDataValue);
    CartDiscountUppdate(cartSumDiscounts, cartSumDiscountData);
    // Сообщение с уведомлением действия
    const notice = data.querySelector(".cartItems__modal > p");
    console.log("[DEBUG]: handleAddtoCartUpdate notice", notice);
    const type = notice?.getAttribute("class").slice(15);
    СreateNoty(type, notice.innerHTML);
  }
}

/**
 * Функция добавления модификации в Корзину.
 * Используется в функциях: на всех страницах с товарами.
 * Использует функции: getHtmlFromUrl, Fancybox, Addto, AddtoCart, AddtoNotify, AddtoOrder, Goods, Dialogs
 */
function AddtoMod(doc = document) {
  const buttons = doc.querySelectorAll(".add-mod");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", handleAddtoModClick);
  });

  function handleAddtoModClick(event) {
    event.preventDefault();
    // console.log("[DEBUG]: handleAddtoModClick event", event);
    const currentTarget = event.currentTarget;
    const url = getUrlBody(currentTarget.getAttribute("href"));
    // console.log("[DEBUG]: handleAddtoModClick url", url);
    getHtmlFromUrl(url).then((data) => {
      // console.log("[DEBUG]: handleAddtoModClick data", data);
      handleAddtoModOpen(data);
    });
  }

  function handleAddtoModOpen(data) {
    // console.log("[DEBUG]: handleAddtoModOpen data", data);
    const content = data.querySelector(".productView");
    new Fancybox(
      [
        {
          src: content,
          type: "html",
        },
      ],
      {
        mainClass: "productViewMod",
        hideScrollbar: false,
        on: {
          done: () => {
            Addto(content);
            AddtoCart(content);
            AddtoNotify(content);
            AddtoOrder(content);
            Goods(content);
            Dialogs(content);
            console.log("content", content);
            console.log("content", content.querySelector(".productView__add"));
            content.querySelector(".productView__add").focus();
          },
        },
      },
    );
  }
}

/**
 * Функция Быстрый заказ.
 * Используется в функциях: handleAddtoModOpen, на всех страницах с товарами.
 * Использует функции: getHtmlFromPost, handleAddtoOrderOpen, handleAddtoOrderUpdate, CartRemove, CartClear,
 * Использует функции: Fancybox, Orderfast, Passwords, OrderCoupons, CartMinSum, ValidateRequired, CartCountUppdate, CartDiscountUppdate
 */
function AddtoOrder(doc = document) {
  const buttons = doc.querySelectorAll(".add-order");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", handleAddtoOrderClick);
  });

  function handleAddtoOrderClick(event) {
    event.preventDefault();
    // console.log("[DEBUG]: handleAddtoModClick event", event);
    const currentTarget = event.currentTarget;
    const form = currentTarget.closest("form");
    const url = form.getAttribute("action");
    const formData = new FormData(form);
    formData.append("ajax_q", "1");
    formData.append("fast_order", "1");
    // console.log("[DEBUG]: handleAddtoModClick event", event);
    // console.log("[DEBUG]: form", form);
    // console.log("[DEBUG]: url", url);

    getHtmlFromPost(url, formData).then((data) => {
      handleAddtoOrderOpen(data);
      handleAddtoOrderUpdate(data);
      CartRemove();
      CartClear();
    });
    event.currentTarget.parentElement.classList.add("has-in-cart");
  }

  function handleAddtoOrderOpen(data) {
    // console.log("[DEBUG]: handleAddtoModOpen data", data);
    const content = data.querySelector(".page-orderfast");
    // const dialog = DialogsCreate("productViewMod", "Карточка товара", content);
    // const dialogClose = DialogsCloser(dialog);
    // // Запуск функций
    // DialogsHandler(dialog, dialogClose);
    new Fancybox(
      [
        {
          src: content,
          type: "html",
        },
      ],
      {
        mainClass: "productViewOrder",
        hideScrollbar: false,
        on: {
          done: () => {
            Orderfast();
            Passwords();
            OrderCoupons();
            CartMinSum();
            const form = document.querySelector(".orderfast__form");
            ValidateRequired(form);
            new AirDatepicker("#order_delivery_convenient_date", {
              autoClose: true,
              onSelect: function ({datepicker}) {
                ValidateInput(datepicker.$el);
              },
            });
          },
        },
      },
    );
  }

  function handleAddtoOrderUpdate(data) {
    // console.log("[DEBUG]: handleAddtoOrderUpdate data", data);
    const cartAddto = document.querySelector(".addto__cart");
    const cartAddtoData = data.querySelector("#newCartData");
    const cartSumDiscounts = document.querySelectorAll(".cart-discount");
    const cartSumDiscountData = data.querySelector(".cart-discount");
    const cartCounts = document.querySelectorAll(".cart-count");
    const cartCountDataValue = data.querySelector(".cart-count").value;
    // Обновление данных
    cartAddto.innerHTML = cartAddtoData.innerHTML;
    CartCountUppdate(cartCounts, cartCountDataValue);
    CartDiscountUppdate(cartSumDiscounts, cartSumDiscountData);
  }
}

/**
 * Функция Уведомления.
 * Используется в функциях: handleAddtoModOpen, на всех страницах с товарами.
 */
function AddtoNotify(doc = document) {
  const buttons = doc.querySelectorAll(".add-notify");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", handleAddtoNotifyClick);
  });

  function handleAddtoNotifyClick(event) {
    console.log("event1", event);
    const currentTarget = event.currentTarget;
    const goodsForm = currentTarget.closest("form");
    const goodsModId = goodsForm.querySelector("[name='form[goods_mod_id]']");
    const dialog = document.querySelector("#dialogNotify");
    const dialogModId = dialog.querySelector("[name='form[goods_mod_id]']");
    dialogModId.value = goodsModId.value;
  }
}

/**
 * Стикер разницы в цене.
 * Используется в функциях: Products, Goods
 * Использует функции: getMoneyFormat
 */
function StickerSales(selector, type = "percent") {
  const sticker = selector.querySelector(".sticker--sales");
  if (!sticker) return;
  const priceNow = selector.querySelector(".price__now");
  const priceOld = selector.querySelector(".price__old");
  if (!priceOld) {
    sticker.style.display = "none";
    return;
  }
  if (type === "percent") {
    const diffPercent = (((priceOld.getAttribute("data-price") - priceNow.getAttribute("data-price")) / priceOld.getAttribute("data-price")) * 100).toFixed();
    sticker.innerHTML = `–${diffPercent}%`;
  } else {
    const diff = (priceOld.getAttribute("data-price") - priceNow.getAttribute("data-price")).toFixed();
    sticker.innerHTML = `<span class="RUB"><span class="num">-${getMoneyFormat(diff)}</span></span>`;
  }
}

/**
 * Фильтры.
 * Используется в функциях: на странице Товары(каталог).
 * Использует функции: Jquery ui slider
 */
function Filters() {
  // Выбора фильтра
  const filters = document.querySelector(".filters");
  // console.log("[DEBUG]: filters", filters);
  if (!filters) return;
  const filterLists = filters.querySelectorAll(".filter__list");
  if (filterLists.length !== 0) {
    let filtersChecked = 0;
    filterLists.forEach((list) => {
      let filterChecked = 0;
      list.querySelectorAll("input[type=checkbox]").forEach((input) => {
        // console.log("[DEBUG]: input", input);
        input.addEventListener("click", (event) => {
          event.target.form.submit();
        });

        if (input.checked) {
          filterChecked++;
          filtersChecked++;
        }

        const filterOpenerCount = document.querySelector(".filters__open b");
        if (filterOpenerCount) {
          filterOpenerCount.innerHTML = filtersChecked > 0 ? filtersChecked : "";
        }
      });

      const filterListCount = list.querySelector(".filter__title b");
      // console.log("[DEBUG]: filterChecked", filterChecked);
      if (filterListCount) {
        filterListCount.innerHTML = filterChecked > 0 ? filterChecked : "";
      }
    });
  }

  // Открытие фильтров
  SidebarOpener(".filters", ".filters__open");

  // Фильтр цены
  function filterPrice() {
    const priceFilterMinAvailable = parseInt($('[name="form[filter][available_price][min]"]').val()), // Минимальное значение цены для фильтра
      priceFilterMaxAvailable = parseInt($('[name="form[filter][available_price][max]"]').val()), // Максимальное значение цены для фильтра
      priceSliderBlock = $("#goods-filter-price-slider"), // Максимальное значение цены для фильтра
      priceInputMin = $("#filter-price-min"), // Поле ввода текущего значения цены "От"
      priceInputMax = $("#filter-price-max"), // Поле ввода текущего значения цены 'До'
      priceSubmitButtonBlock = $(".filters-price__buttons"); // Блок с кнопкой, которую есть смысл нажимать только тогда, когда изменялся диапазон цен.

    // Слайдер, который используется для удобства выбора цены
    if (priceSliderBlock) {
      priceSliderBlock.slider({
        range: true,
        min: priceFilterMinAvailable,
        max: priceFilterMaxAvailable,
        values: [parseInt($("#filter-price-min").val()), parseInt($("#filter-price-max").val())],
        slide: function (event, ui) {
          priceInputMin.val(ui.values[0]);
          priceInputMax.val(ui.values[1]);
          priceSubmitButtonBlock.css("display", "flex");
        },
      });
    }

    // При изменении минимального значения цены
    priceInputMin.keyup(function () {
      let newVal = parseInt($(this).val());
      if (newVal < priceFilterMinAvailable) {
        newVal = priceFilterMinAvailable;
      }
      priceSliderBlock.slider("values", 0, newVal);
      priceSubmitButtonBlock.css("display", "flex");
    });

    // При изменении максимального значения цены
    priceInputMax.keyup(function () {
      let newVal = parseInt($(this).val());
      if (newVal > priceFilterMaxAvailable) {
        newVal = priceFilterMaxAvailable;
      }
      priceSliderBlock.slider("values", 1, newVal);
      priceSubmitButtonBlock.css("display", "flex");
    });

    // Активный фильтр цены
    if (priceInputMin.val() > priceFilterMinAvailable || priceInputMax.val() < priceFilterMaxAvailable) {
      $(".filters-price").addClass("has-filters");
      $(".toolbar").addClass("has-filters");
    } else {
      $(".filters-price").removeClass("has-filters");
      $(".toolbar").removeClass("has-filters");
    }
  }
  filterPrice();

  // Фильтр сворачиваний
  function filterCollapse() {
    const filterCollapse = document.querySelectorAll(".filter__list");
    if (filterCollapse.length === 0) return;

    filterCollapse.forEach((filter) => {
      const filterTitle = filter.querySelector(".filter__title");

      // Фильтр цены не сворачивается
      if (filter.classList.contains("filters-price")) return;

      filterTitle?.addEventListener("click", () => {
        filterTitle.parentElement.classList.toggle("has-filters");
      });
    });
  }
  filterCollapse();

  // Фильтр в наличии
  function filterRest() {
    const button = document.querySelector(".filters-rest__open");
    if (!button) return;
    const form = document.querySelector(".filters__form");
    if (!form) return;

    button.addEventListener("click", (event) => {
      event.preventDefault();
      const url = form.getAttribute("action");
      const formData = new FormData(form);
      console.log("active", button.classList.contains("is-active"));
      if (button.classList.contains("is-active")) {
        button.classList.remove("is-active");
        formData.set("form[filter_only_with_rest]", "0");
        console.log("formData1", formData.get("form[filter_only_with_rest]"));
      } else {
        button.classList.add("is-active");
        formData.set("form[filter_only_with_rest]", "1");
        console.log("formData2", formData.get("form[filter_only_with_rest]"));
      }
      updateProductsContainer(url, formData);
    });

    function updateProductsContainer(url, formData) {
      getHtmlFromPost(url, formData)
        .then((data) => {
          // Обработать ответ (например, обновить интерфейс)
          const container = document.querySelector(".products__container");
          const containerData = data.querySelector(".products__container");
          container.innerHTML = containerData.innerHTML;
          console.log("formData30", formData);
          Filters();
        })
        .catch((error) => {
          console.error("Ошибка:", error);
        });
    }
  }
  filterRest();
}

/**
 * Тулбар.
 * Используется в функциях: на странице Товары(каталог), Поиск, Акции.
 */
function Toolbar() {
  const toolbar = document.querySelector(".toolbar");
  if (!toolbar) return;
  const toolbarSelects = toolbar.querySelectorAll(".toolbar__selects");

  toolbarSelects.forEach((select) => {
    select.addEventListener("change", handleToolbarSelectChange);
  });

  function handleToolbarSelectChange(event) {
    // console.log("[DEBUG]: handleToolbarSelectChange", event.target.value);
    // console.log("[DEBUG]: form", event.target.closest("form"));
    event.target.closest("form").submit();
  }
}

/**
 * Товары.
 * Используется в функциях: на страницах с "Товарами"
 * Использует функции: StickerSales
 */
function Products() {
  const products = document.querySelectorAll(".product__item");
  if (products.length === 0) return;
  products.forEach((product) => {
    // Запуск функции стикера цены.
    StickerSales(product);
    attrs(product);
  });

  // Показать/скрыть характеристики товара
  function attrs(product) {
    const button = product.querySelector(".product__attr-button");
    const content = product.querySelector(".product__attr");

    if (button && content) {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        button.classList.toggle("is-active");
        content.classList.toggle("is-active");
        SlotText(event.currentTarget);
      });
    }
  }
}

/**
 * Страница "Товар".
 * Используется в функциях: на странице "Товар".
 * Использует функции: Fancybox, Swiper
 */
function Goods(doc) {
  const productViewBlock = doc || document.querySelector(".productView");
  // console.log("[DEBUG]: productViewBlock", productViewBlock);
  if (!productViewBlock) return;

  const productViewSlugs = productViewBlock.querySelectorAll(".modifications-slugs");
  const productViewItems = productViewBlock.querySelectorAll(".modifications-values__item");
  const productViewButtons = productViewBlock.querySelectorAll(".modifications-values__button");
  const productViewSelects = productViewBlock.querySelectorAll(".modifications-props__select");

  productViewButtons.forEach((button) => {
    button.addEventListener("click", (event, index) => {
      event.currentTarget.parentElement.querySelectorAll("button").forEach((item) => item.classList.remove("is-active"));
      event.currentTarget.classList.add("is-active");
      handleDisabledButtons(index);
      // Обновляем данные модификации
      const checkedArray = Array.from(productViewButtons)
        .filter((button) => button.classList.contains("is-active"))
        .map((button) => button.getAttribute("data-id"));
      handleSlugsActived(checkedArray);
    });
  });

  function handleDisabledButtons(flag) {
    // Проверяем в каждом соседнем поле выбора модификаций, возможно ли подобрать модификацию для указанных свойств
    productViewItems.forEach((items, index) => {
      // Если мы сравниваем значения свойства не с самим собой, а с другим списком значений свойств
      if (index != flag) {
        // Проходим по всем значениям текущего свойства модификации товара
        items.querySelectorAll("button").forEach((button) => {
          // Записываем временный массив свойств, которые будем использовать для проверки существования модификации
          const checkProperties = new Array();
          productViewItems.forEach((item, i) => (checkProperties[i] = item.querySelector("button.is-active").getAttribute("data-id")));
          // Пытаемся найти модификацию соответствующую выбранным значениям свойств
          checkProperties[index] = button.getAttribute("data-id");
          // Собираем хэш определяющий модификацию по свойствам
          const slug = checkProperties.sort((a, b) => a - b).join("_");
          // Ищем модификацию по всем выбранным значениям свойств товара. Если модификации нет в возможном выборе, отмечаем потенциальное значение выбора как не доступное для выбора, т.к. такой модификации нет.
          const isActiveSlug = document.querySelector('[data-slugs="' + slug + '"]');
          if (isActiveSlug) {
            button.removeAttribute("disabled");
          } else {
            button.setAttribute("disabled", "disabled");
          }
        });
      }
    });
  }
  handleDisabledButtons(0);
  handleDisabledButtons(1);

  productViewSelects.forEach((select) => {
    select.addEventListener("change", (event, index) => {
      handleDisabledSelects(index);
      // Обновляем данные модификации
      const checkedArray = Array.from(productViewSelects).map((select) => select.value);
      handleSlugsActived(checkedArray);
    });
  });

  function handleDisabledSelects(flag) {
    // Проверяем в каждом соседнем поле выбора модификаций, возможно ли подобрать модификацию для указанных свойств
    productViewSelects.forEach((selects, index) => {
      // Если мы сравниваем значения свойства не с самим собой, а с другим списком значений свойств
      if (index != flag) {
        // Проходим по всем значениям текущего свойства модификации товара
        selects.querySelectorAll("option").forEach((option) => {
          // Записываем временный массив свойств, которые будем использовать для проверки существования модификации
          const checkProperties = new Array();
          productViewSelects.forEach((select, i) => (checkProperties[i] = select.value));
          // Пытаемся найти модификацию соответствующую выбранным значениям свойств
          checkProperties[index] = option.value;
          // Собираем хэш определяющий модификацию по свойствам
          const slug = checkProperties.sort((a, b) => a - b).join("_");
          // Ищем модификацию по всем выбранным значениям свойств товара. Если модификации нет в возможном выборе, отмечаем потенциальное значение выбора как не доступное для выбора, т.к. такой модификации нет.
          const isActiveSlug = document.querySelector('[data-slugs="' + slug + '"]');
          if (isActiveSlug) {
            option.removeAttribute("disabled");
          } else {
            option.setAttribute("disabled", "disabled");
          }
        });
      }
    });
  }
  handleDisabledSelects(0);
  handleDisabledSelects(1);

  function handleSlugsActived(checked) {
    const slug = checked.sort((a, b) => a - b).join("_");
    const slugActived = productViewBlock.querySelector('.modifications-slugs[data-slugs="' + slug + '"]');
    productViewSlugs.forEach((slug) => slug.classList.remove("is-active"));
    slugActived.classList.add("is-active");
    handleModUpdate(slugActived);
  }

  // Обновление модификации
  function handleModUpdate(modificationBlock) {
    // Переменные выбранной модификации
    const modificationId = modificationBlock.querySelector('[name="slug[mod_id]"]').value;
    const modificationPriceNow = parseInt(modificationBlock.querySelector('[name="slug[mod_price_now]"]').value);
    const modificationPriceNowFormated = modificationBlock.querySelector(".price_now_formated").innerHTML;
    const modificationPriceOld = parseInt(modificationBlock.querySelector('[name="slug[mod_price_old]"]').value);
    const modificationPriceOldFormated = modificationBlock.querySelector(".price_old_formated").innerHTML;
    const modificationRestValue = parseInt(modificationBlock.querySelector('[name="slug[mod_rest_value]"]').value);
    const modificationMeasure = modificationBlock.querySelector('[name="slug[mod_measure_name]"]').value;
    const modificationArtNumber = modificationBlock.querySelector('[name="slug[mod_sku]"]').value;
    const modificationDescription = modificationBlock.querySelector(".description").innerHTML;
    const modificationModImageId = parseInt(modificationBlock.querySelector('[name="slug[mod_image_id]"]').value);
    // Переменные отображаемой модификации
    const goodsModView = productViewBlock;
    const goodsModId = goodsModView.querySelector("[name='form[goods_mod_id]']");
    const goodsPriceBlock = goodsModView.querySelector(".productView__price");
    const goodsPriceNow = goodsPriceBlock.querySelector(".price__now");
    const goodsPriceOld = goodsPriceBlock.querySelector(".price__old");
    const goodsModRestBlock = goodsModView.querySelector(".productView__available");
    const goodsQty = goodsModView.querySelector(".productView__qty");
    const goodsQtyInput = goodsQty.querySelector(".qty__input");
    const goodsArtNumberBlock = goodsModView.querySelector(".productView__articles");
    const goodsModDescription = goodsModView.querySelector(".modifications__description");

    // Цена товара
    goodsPriceNow.setAttribute("data-price", modificationPriceNow);
    goodsPriceNow.innerHTML = modificationPriceNowFormated;

    // Старая цена товара
    if (modificationPriceOld > modificationPriceNow) {
      if (goodsPriceOld === null) {
        const priceOld = document.createElement("s");
        priceOld.className = "price__old";
        priceOld.setAttribute("data-price", modificationPriceOld);
        priceOld.innerHTML = modificationPriceOldFormated;
        priceOld.style.display = "";
        goodsPriceBlock.append(priceOld);
      } else {
        goodsPriceOld.setAttribute("data-price", modificationPriceOld);
        goodsPriceOld.innerHTML = modificationPriceOldFormated;
        goodsPriceOld.style.display = "";
      }
    } else {
      if (goodsPriceOld) {
        goodsPriceOld.style.display = "none";
      }
    }

    // Наличие
    goodsModView.setAttribute("data-rest-value", modificationRestValue);
    goodsModRestBlock.setAttribute("data-value", modificationRestValue);
    goodsModRestBlock.querySelector("b").innerHTML = modificationRestValue + " " + modificationMeasure;

    goodsQtyInput.value = 1;
    if (modificationRestValue > 0 && modificationRestValue < 10) {
      // Мало в наличии
      goodsModRestBlock.classList.remove("rest--zero", "rest--alot");
      goodsModRestBlock.classList.add("rest--few");
    } else if (modificationRestValue > 9) {
      // Много в наличии
      goodsModRestBlock.classList.remove("rest--zero", "rest--few");
      goodsModRestBlock.classList.add("rest--alot");
    } else {
      // Нет в наличии
      goodsModRestBlock.classList.remove("rest--few", "rest--alot");
      goodsModRestBlock.classList.add("rest--zero");
      goodsModRestBlock.querySelector("b").innerHTML = "Нет";
      goodsQtyInput.value = 1;
      goodsQtyInput.setAttribute("max", 1);
    }

    // Если включено в настройках 'Отключить возможность класть в корзину больше товара, чем есть в наличии'
    // console.log('[DEBUG]: goodsQty.classList.contains("has-max")', goodsQty.classList.contains("has-max"));
    if (goodsQty.classList.contains("has-max")) {
      goodsQtyInput.max = modificationRestValue;
    } else {
      goodsQtyInput.max = 99999;
    }

    // Покажем артикул модификации товара, если он указан
    // console.log("[DEBUG]: modificationArtNumber", modificationArtNumber);
    if (modificationArtNumber) {
      goodsArtNumberBlock.removeAttribute("hidden");
      goodsArtNumberBlock.parentElement.removeAttribute("hidden");
      goodsArtNumberBlock.parentElement.classList.remove("is-hide");
      goodsArtNumberBlock.querySelector("b").innerHTML = modificationArtNumber;
    } else {
      if (goodsArtNumberBlock) {
        goodsArtNumberBlock.setAttribute("hidden", "");
        goodsArtNumberBlock.parentElement.setAttribute("hidden", "");
        goodsArtNumberBlock.parentElement.classList.add("is-hide");
        goodsArtNumberBlock.querySelector("b").innerHTML = "";
        if (document.querySelector(".productView__sticker")) {
          goodsArtNumberBlock.parentElement.classList.remove("is-hide");
          if (document.querySelector(".productView.fancybox__content")) {
            goodsArtNumberBlock.parentElement.classList.add("is-hide");
          }
        }
      }
    }

    // Описание модификации товара. Покажем если оно есть, спрячем если его у модификации нет
    if (modificationDescription) {
      goodsModDescription.classList.remove("is-hide");
      goodsModDescription.innerHTML = modificationDescription;
    } else {
      goodsModDescription.classList.add("is-hide");
      goodsModDescription.innerHTML = "";
    }

    // Идентификатор товарной модификации
    goodsModId.value = modificationId;
    goodsQtyInput.setAttribute("name", "form[goods_mod_id][" + modificationId + "]");

    // Обновляем изображние модификации товара, если оно указано
    handleModImage(modificationModImageId, goodsModView);
  }

  // Меняет главное изображение товара на изображение с идентификатором
  function handleModImage(goodsModImageId, block) {
    // console.log("[DEBUG]: goodsModImageId", goodsModImageId);
    // Если не указан идентификатор модификации товара, значит ничего менять не нужно.
    if (!goodsModImageId) return;
    // Блок с изображением выбранной модификации товара
    const goodsModImageBlock = block.querySelector('.thumblist [data-id="' + goodsModImageId + '"');
    // Изображение модификации товара, на которое нужно будет изменить главное изображение товара.
    const mediumImageUrl = goodsModImageBlock.querySelector("a").getAttribute("href");
    // Блок, в котором находится главное изображение товара
    const mainImageBlock = block.querySelector(".productView__image");
    // Главное изображение, в которое будем вставлять новое изображение
    const mainImage = mainImageBlock.querySelector("img");
    const mainImageSource = mainImageBlock.querySelector("source");
    // Если изображение модификации товара найдено - изменяем главное изображение
    mainImage.setAttribute("src", mediumImageUrl);
    mainImage.parentElement.setAttribute("data-src", mediumImageUrl);
    mainImageSource.setAttribute("srcset", mediumImageUrl);
    // Изменяем идентификатор главного изображения
    mainImageBlock.setAttribute("data-id", goodsModImageId);
    block.querySelectorAll(".thumblist__item").forEach((item) => item.classList.remove("is-active"));
    goodsModImageBlock.classList.add("is-active");
    swiper.slideTo(goodsModImageBlock.getAttribute("data-swiper-slide-index"));
  }

  // Функции Дополнительных изображений.
  function Thumbs() {
    const thumblist = document.querySelector(".thumblist");
    if (!thumblist) return;

    // Слайдер дополнительных изображений
    const swiper = new Swiper(".thumblist .swiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 16,
      watchSlidesProgress: true,
      scrollbar: {
        enabled: true,
        el: ".thumblist .swiper-scrollbar",
        snapOnRelease: true,
        draggable: true,
      },
    });

    // const thumbsImages = thumblist.querySelectorAll(".thumblist__image");
    // thumbsImages.forEach((image) => {
    //   image.addEventListener("click", handleThumbsImage);
    // });

    /* Функция Отображения дополнительного изображения на месте основного. */
    // function handleThumbsImage(event) {
    //   event.preventDefault();
    //   const target = event.currentTarget;
    //   const href = target.getAttribute("href");
    //   const mainImage = document.querySelector(".productView__image");
    //   const mainImageImg = mainImage.querySelector("img");
    //   // const mainImageSource = mainImage.querySelector("source");
    //   mainImage.setAttribute("data-src", href);
    //   mainImageImg.setAttribute("src", href);
    //   // mainImageSource.setAttribute("srcset", href);
    //   thumbsImages.forEach((image) => image.parentElement.classList.remove("is-active"));
    //   target.parentElement.classList.add("is-active");
    //   // console.log("[DEBUG]: handleMainImages event", event);
    //   // console.log("[DEBUG]: handleMainImages target", target);
    //   // console.log("[DEBUG]: handleMainImages href", href);
    //   // console.log("[DEBUG]: handleMainImages mainImage", mainImage);
    // }
  }

  // Функция отображения нижней плашки при скроле
  function StickyView() {
    const productView = document.querySelector(".productView");
    const productViewFixed = document.querySelector(".productViewFixed");
    console.log("[DEBUG]: productView", productView);
    console.log("[DEBUG]: productViewFixed", productViewFixed);

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log("[DEBUG]: entry", entry);
        console.log("[DEBUG]: entry.isIntersecting", entry.isIntersecting);
        if (!entry.isIntersecting) {
          productViewFixed.hidden = false; // Показываем плашку
        } else {
          productViewFixed.hidden = true; // Скрываем плашку
        }
      },
      {threshold: 0}, // Срабатывает, когда `.productView` полностью уходит из области видимости
    );

    observer.observe(productView);
  }
  StickyView();

  // Запуск функции стикера цены.
  StickerSales(productViewBlock);
  // Запуск функции Количества.
  Quantity(productViewBlock);
  // Запуск функции Дополнительных изображений.
  Thumbs();
  // Запуск Функции Галереи изображений.
  Fancybox.bind('[data-fancybox="gallery"]');
  // Открытие доставки
  SidebarOpener("#deliverys", ".delivery__open");
}

/**
 * Товар. Отзывы.
 * Используется в функциях: на странице "Товар".
 */
function Opinions() {
  const container = document.getElementById("opinions");
  if (!container) return;

  const opinions = container.querySelectorAll(".opinion__item");
  // const opinionsLength = opinions.length;
  // console.log("[DEBUG]: opinions", opinions);

  // Добавить отзыв
  const opinionAdd = container.querySelector(".opinion__score-button");
  opinionAdd?.addEventListener("click", () => {
    setTimeout(() => {
      document.getElementById("goods_opinion_name").focus();
    }, 100);
  });

  // Хороший/Плохой отзыв
  let countGood = 0;
  let countBad = 0;
  opinions.forEach((opinion) => {
    const generally = opinion.getAttribute("data-generally");
    if (generally === "good") {
      countGood += 1;
    } else if (generally === "bad") {
      countBad += 1;
    }
    handleOpinionAvatarName(opinion);
  });

  // Добавления первой буквы Имени или Заголовка в Аватар
  function handleOpinionAvatarName(opinion) {
    const avatar = opinion.querySelector(".opinion__block-avatar");
    const name = opinion.querySelector(".opinion__name");
    if (avatar) {
      avatar.innerText = name.innerText.charAt(0);
    }
    // console.log("[DEBUG]: name", name);
    // console.log("[DEBUG]: avatar", avatar);
    // console.log("[DEBUG]: name.charAt(0)", name.innerText.charAt(0));
  }

  // Рейтинг при добавлении отзыва
  function initRating(container) {
    const stars = container.querySelectorAll(".form__rating label");
    let starsActive;

    stars.forEach((element, index) => {
      element.addEventListener("mouseover", () => {
        starsActive = Array.prototype.slice.call(stars, 0, index + 1);
        starsActive.forEach((star) => {
          star.classList.add("is-active");
        });
      });

      element.addEventListener("mouseout", () => {
        stars.forEach((star) => {
          star.classList.remove("is-active");
        });
      });

      element.addEventListener("click", () => {
        stars.forEach((star) => {
          star.classList.remove("is-select");
        });
        starsActive.forEach((star) => {
          star.classList.add("is-select");
        });
        starsSelect = starsActive;
      });
    });
  }
  initRating(container);

  // Капча
  function initCaptcha() {
    const captcha = document.querySelector(".captcha");
    // console.log("[DEBUG]: captcha", captcha);
    if (!captcha) return false;
    const captchaButton = captcha.querySelector(".captcha__refresh");
    const captchaImage = captcha.querySelector(".captcha__image");

    // Действие при клике
    captchaButton.addEventListener("click", handleCaptchaClick);

    // Функции при клике
    function handleCaptchaClick(event) {
      event.preventDefault();
      // console.log("[DEBUG]: handleCaptchaClick", event);
      handleCaptchaRefresh(event.target, 1, 1);
      captchaImage.setAttribute("src", captchaImage.getAttribute("src") + "&rand" + Math.random(0, 10000));
    }

    // Крутит изображение при обновлении картинки защиты от роботов
    function handleCaptchaRefresh(img, num, cnt) {
      if (cnt > 13) return false;
      img.setAttribute("src", img.getAttribute("rel") + "icon/refresh/" + num + ".gif");
      num = num == 6 ? 0 : num;
    }
  }
  initCaptcha();

  // // Рекомендуемый %
  // const scoreTotal = container.querySelector(".opinion__score-total");
  // if (scoreTotal) {
  //   const scoreTotalNumber = scoreTotal.querySelector("b");
  //   const scoreTotalPercent = parseInt((countGood / opinionsLength) * 100) + "%";
  //   scoreTotalNumber.innerHTML = scoreTotalPercent;
  // }

  // // Общий  Счётчик рейтинга для отзывов jQuery. Переписать на JS и проверить работу
  // for (let i = 1; i < 6; i++) {
  //   const opinionsRating = $(".opinion__item[data-rating=" + i + "]").length;
  //   const percent = parseInt(100 / (opinionsLength / opinionsRating));
  //   $(".opinion__grade[data-number=" + i + "] .opinion__grade-number").text(opinionsRating);
  //   $(".opinion__grade[data-number=" + i + "] progress").val(percent);
  // }

  // // Показать/скрыть все отзывы
  // const opinionButton = container.querySelector(".opinion__button");
  // if (opinionButton) {
  //   opinionButton.style.display = opinionsLength > 3 ? "" : "none";
  //   opinionButton.addEventListener("click", (event) => {
  //     const items = container.querySelector(".opinion__items");
  //     items.classList.toggle("opinion__items--show");
  //     const target = event.currentTarget;
  //     target.classList.toggle("is-active");
  //     if (target.classList.contains("is-active")) {
  //       target.innerHTML = "Скрыть отзывы";
  //     } else {
  //       target.innerHTML = "Показать все отзывы";
  //       container.scrollIntoView();
  //     }
  //   });
  // }
}

/**
 * Количество
 * Используется в функциях: handleCartInit, Goodsб на странице "Товар", "Корзина"
 * Использует функции: СreateNoty
 */
function Quantity(doc = document) {
  // console.log("[DEBUG]: Quantity doc", doc);
  const qtys = doc.querySelector(".qty");
  if (!qtys) return;
  const minus = qtys.querySelector(".qty__select--minus");
  const plus = qtys.querySelector(".qty__select--plus");
  const input = qtys.querySelector(".qty__input");

  minus.addEventListener("click", () => {
    const val = parseInt(input.value) - 1;
    handleValueInput(val, input);
  });

  plus.addEventListener("click", () => {
    const val = parseInt(input.value) + 1;
    handleValueInput(val, input);
  });

  input.addEventListener("input", (event) => {
    // console.log("[DEBUG]: input event", event);
    const val = parseInt(input.value);
    handleValueMin(val, input);
    handleValueMax(val, input);

    if (event.target.closest(".productView")) {
      // console.log("[DEBUG]: input event2", val);
      handleQuantityProductView(val, input);
    }
  });

  function handleValueInput(val, input) {
    input.value = val;
    input.setAttribute("value", val);
    input.dispatchEvent(new Event("input"));
  }

  function handleValueMin(val, input) {
    if (val < 1) {
      input.value = 1;
      input.setAttribute("value", 1);
    }
  }

  function handleValueMax(val, input) {
    // console.log("[DEBUG]: val", val);
    // console.log("[DEBUG]: input.max", input.max);
    if (val > input.max) {
      input.value = input.max;
      input.setAttribute("value", input.max);
      // Сообщение пользователю
      СreateNoty("error", "Вы пытаетесь положить в корзину товар которого недостаточно в наличии");
    }
  }

  function handleQuantityProductView(val, input) {
    // console.log("[DEBUG]: input", input);
    if (val < 1) val = 1;
    if (val > input.max) val = input.max;
    const productView = input.closest(".productView");
    const priceNow = productView.querySelector(".price__now");
    const priceNowValue = priceNow.getAttribute("data-price") * val;
    priceNow.querySelector(".num").innerHTML = getMoneyFormat(priceNowValue);
    const priceOld = productView.querySelector(".price__old");
    const priceOldValue = parseInt(priceOld.getAttribute("data-price")) * val;
    if (priceOldValue > 0) {
      priceOld.querySelector(".num").innerHTML = getMoneyFormat(priceOldValue);
    }
    // console.log("[DEBUG]: productView", productView);
    // console.log("[DEBUG]: priceNow", priceNow);
    // console.log("[DEBUG]: priceOld", priceOld);
    // console.log("[DEBUG]: priceNowValue", priceNowValue);
    // console.log("[DEBUG]: priceOldValue", priceOldValue);
  }
}

/**
 * Страница: Сравнение товаров
 */
function Compare() {
  const compareTable = document.querySelector(".compare__table");
  if (!compareTable) return;

  const swiper = new Swiper(".compare__line", {
    loop: false,
    allowTouchMove: false,
    autoplay: false,
    autoHeight: true,
    draggable: false,
    freeMode: false,
    grabCursor: false,
    simulateTouch: false,
    slidesPerView: 4,
    spaceBetween: 16,
    watchSlidesProgress: true,
    lazy: {
      enabled: false,
      loadPrevNext: true,
      loadOnTransitionStart: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: "1",
      },
      320: {
        slidesPerView: "2",
      },
      480: {
        slidesPerView: "2",
      },
      640: {
        slidesPerView: "3",
      },
      768: {
        slidesPerView: "3",
      },
      1024: {
        slidesPerView: "4",
      },
      1200: {
        slidesPerView: "4",
      },
    },
  });

  const switcher = compareTable.querySelector(".compare__switcher");
  const switcherInput = switcher.querySelector("input");
  const compareLines = compareTable.querySelectorAll(".compare__line");
  const compareInputs = compareTable.querySelectorAll(".compare__input");
  const compareButtonShow = compareTable.querySelector(".compare__button-show");
  const compareButtonHide = compareTable.querySelector(".compare__button-hide");
  switcherInput.addEventListener("change", handleSwitcherInput);
  compareInputs.forEach((element) => element.addEventListener("change", handleCompareInput));
  compareButtonShow.addEventListener("click", handleCompareButtonShow);
  compareButtonHide.addEventListener("click", handleCompareButtonHide);

  function handleSwitcherInput(event) {
    if (event.currentTarget.checked) {
      compareButtonShow.classList.remove("is-hide");
      compareLines.forEach((element) => (element.style.display = element.matches(".is-same") ? "none" : ""));
    } else {
      compareButtonShow.classList.add("is-hide");
      compareLines.forEach((element) => (element.style.display = ""));
    }
  }

  function handleCompareInput() {
    compareButtonHide.classList.remove("is-hide");
  }

  function handleCompareButtonShow(event) {
    // console.log("handleCompareButtonShow", event.currentTarget);
    event.currentTarget.classList.add("is-hide");
    switcherInput.checked = false;
    compareLines.forEach((element) => (element.style.display = ""));
  }

  function handleCompareButtonHide() {
    compareButtonShow.classList.remove("is-hide");
    compareLines.forEach((element) => {
      const сhecked = element.querySelector(".compare__input:checked");
      if (сhecked) element.style.display = "none";
    });
  }
}

/**
 * Страница: Корзина
 * Используется в функциях: на странице "Корзина"
 * Использует функции: CartMinSum, Dialogs, getHtmlFromUrl, getHtmlFromPost
 * Использует функции: Orderfast, Passwords, OrderCoupons, ValidateRequired
 */
function Cart() {
  function handleCartInit() {
    const container = document.querySelector(".page-cart");
    const cartInner = container.querySelector(".cartInner");
    // console.log("cartInner", cartInner);
    if (!cartInner) return;
    const cartRemoves = cartInner.querySelectorAll("[data-action=removeCartItem]");
    const cartClear = cartInner.querySelector("[data-action=clearCart]");
    const cartItem = cartInner.querySelectorAll(".cartTable__item");
    const cartQtyInputs = cartInner.querySelectorAll(".qty__input");

    cartRemoves.forEach((remove) => remove.addEventListener("click", handleCartRemoveItem));
    cartClear.addEventListener("click", handleCartClear);
    cartItem.forEach((item) => Quantity(item));
    cartQtyInputs.forEach((input) => input.addEventListener("input", handleCartQtyInput));
    CartMinSum();
    handleCartOrder();
  }
  handleCartInit();

  // Удаление товара из корзины
  function handleCartRemoveItem(event) {
    event.preventDefault();
    const yep = confirm("Вы точно хотите удалить товар из корзины?");
    if (yep === false) return;
    // event.currentTarget.closest(".cartTable__item").style.display = "none";
    const url = event.currentTarget.getAttribute("href");
    getHtmlFromUrl(url).then((html) => {
      // console.log("[DEBUG]: handleCartRemove html", html);
      // console.log("[DEBUG]: handleCartRemove url", url);
      document.querySelector(".page-cart").innerHTML = html.querySelector(".page-cart").innerHTML;
      handleCartInit();
      Dialogs();
    });
  }

  // Очистка товаров из корзины
  function handleCartClear(event) {
    event.preventDefault();
    const yep = confirm("Вы точно хотите очистить корзину?");
    if (yep === false) return;
    const url = event.currentTarget.getAttribute("href");
    getHtmlFromUrl(url).then((data) => {
      document.querySelector(".page-cart").innerHTML = data.querySelector(".page-cart").innerHTML;
    });
  }

  // Изменение количества в корзине
  function handleCartQtyInput(event) {
    // console.log("[DEBUG]: handleCartQtyInput event", event);
    event.preventDefault();
    const currentTarget = event.currentTarget;
    const cartForm = currentTarget.closest("form");
    const cartFormUrl = cartForm.getAttribute("action");
    const cartFormData = new FormData(cartForm);
    cartFormData.append("ajax_q", "1");
    // Отправка запроса
    getHtmlFromPost(cartFormUrl, cartFormData).then((data) => {
      const cartItem = currentTarget.closest(".cartTable__item");
      const cartItemModId = cartItem.getAttribute("data-mod-id");
      const cartItemPrice = cartItem.querySelector(".cartTable__price");
      const cartTotal = document.querySelector(".cartTotal__items");
      // const cartHeader = document.querySelector(".cartTable__header");
      const dataItemPrice = data.querySelector('.cartTable__item[data-mod-id="' + cartItemModId + '"] .cartTable__price');
      const dataCartTotal = data.querySelector(".cartTotal__items");
      // const dataCartHeader = data.querySelector(".cartTable__header");
      const cartTotalMin = document.querySelector(".cartTotal__min");
      const dataCartTotalMin = data.querySelector(".cartTotal__min");
      cartTotal.innerHTML = dataCartTotal.innerHTML;
      cartItemPrice.innerHTML = dataItemPrice.innerHTML;
      // cartHeader.innerHTML = dataCartHeader.innerHTML;
      cartTotalMin.innerHTML = dataCartTotalMin.innerHTML;
      CartMinSum();
      handleCartOrder();
    });
  }

  //
  function handleCartOrder() {
    const container = document.querySelector(".page-cart");
    // console.log("container", container);
    if (!container) return;
    const cartButtonStart = container.querySelector("[data-action=startOrder]");
    const cartButtonClose = container.querySelector("[data-action=closeOrder]");
    const cartButtonComplete = container.querySelector("[data-action=completeOrder]");
    const contrainerAjax = container.querySelector(".cartTable__ajax");
    cartButtonStart?.addEventListener("click", handleCartOrderStart);
    cartButtonClose?.addEventListener("click", handleCartOrderClose);
    cartButtonComplete?.addEventListener("click", handleCartOrderComplete);

    function handleCartOrderStart(event) {
      // console.log("[DEBUG]: event2", event);
      event.preventDefault();
      container.classList.add("is-loading");
      const url = "/cart/add";
      const formData = new FormData();
      formData.append("ajax_q", "1");
      formData.append("fast_order", "1");
      container.classList.add("is-started");
      getHtmlFromPost(url, formData).then((data) => {
        // console.log("[DEBUG]: formData", formData);
        // console.log("[DEBUG]: data", data);
        contrainerAjax.innerHTML = data.querySelector(".page-orderfast").innerHTML;
        scrollTop(contrainerAjax.offsetTop);
        Orderfast();
        Passwords();
        OrderCoupons();
        container.classList.remove("is-loading");
        contrainerAjax.removeAttribute("hidden");
        new AirDatepicker("#order_delivery_convenient_date", {
          autoClose: true,
          onSelect: function ({datepicker}) {
            ValidateInput(datepicker.$el);
          },
        });
      });
    }

    function handleCartOrderClose() {
      contrainerAjax.setAttribute("hidden", "");
      container.classList.remove("is-started");
      const url = "/cart/add";
      getHtmlFromUrl(url).then((data) => {
        const cartTotalItems = document.querySelector(".cartTotal__items");
        const dataCartTotalItems = data.querySelector(".cartTotal__items");
        cartTotalItems.innerHTML = dataCartTotalItems.innerHTML;
        document.querySelector(".orderfast__container").remove();
        CartMinSum();
      });
    }

    function handleCartOrderComplete() {
      const form = container.querySelector(".orderfast__form");
      ValidateRequired(form);
    }
  }
}

/**
 * Функция вычисления остатка до минимальной суммы заказа
 * Используется в функциях: handleCartInit, handleCartQtyInput, handleCartOrderClose, handleAddtoOrderOpen
 * Использует функции: getMoneyFormat
 */
function CartMinSum() {
  const cartMins = document.querySelectorAll(".cartTotal__min");
  const cartButtonStart = document.querySelector("[data-action=startOrder]");

  if (cartMins.length === 0) {
    cartButtonStart.removeAttribute("disabled");
    cartButtonStart.classList.remove("button-disabled");
  }

  cartMins.forEach((cartMin) => {
    const price = cartMin.querySelector("data");
    const minPrice = parseInt(price.value);
    const totalSum = parseInt(price.getAttribute("data-total"));
    console.log("[DEBUG]: minPrice", minPrice);
    console.log("[DEBUG]: totalSum", totalSum);
    if (minPrice > totalSum) {
      const diff = minPrice - totalSum;
      price.querySelector(".num").innerHTML = getMoneyFormat(diff);
      cartButtonStart.setAttribute("disabled", "");
      cartButtonStart.classList.add("button-disabled");
      cartMin.classList.remove("is-hide");
      cartMin.parentElement.classList.add("is-min");
    } else {
      cartButtonStart.removeAttribute("disabled");
      cartButtonStart.classList.remove("button-disabled");
      cartMin.classList.add("is-hide");
      cartMin.parentElement.classList.remove("is-min");
    }
  });
}

/**
 * Функция очистить товары в корзине.
 * Используется в функциях: handleAddtoCartClick, handleAddtoOrderClick, handleCartClear, на всех страницах.
 * Использует функции: getUrlBody, getHtmlFromUrl
 */
function CartClear() {
  const button = document.querySelector(".addto__clear");
  if (!button) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const url = getUrlBody(button.getAttribute("href"));
    if (confirm("Вы точно хотите очистить корзину?")) {
      getHtmlFromUrl(url).then((data) => {
        // console.log("[DEBUG]: getHtmlFromUrl data", data);
        document.querySelectorAll(".cart").forEach((element) => element.classList.add("is-empty"));
        document.querySelectorAll(".cart .addto__item").forEach((element) => element.remove());
        const productViewCart = document.querySelector(".productView__cart");
        // console.log("[DEBUG]: productView2", productView);
        if (productViewCart) {
          productViewCart.classList.remove("has-in-cart");
        }
      });
    }
  });
}

/**
 * Функция удаления товара из корзины.
 * Используется в функциях: handleAddtoCartClick, handleAddtoOrderClick, на всех страницах.
 * Использует функции: getUrlBody, getHtmlFromUrl, CartCountUppdate, CartCountendUppdate, CartDiscountUppdate
 */
function CartRemove() {
  const buttons = document.querySelectorAll(".addto__remove");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (confirm("Вы точно хотите удалить товар из корзины?")) {
        const cartCounts = document.querySelectorAll(".cart-count");
        const cartCountends = document.querySelectorAll(".cart-countend");
        const cartDiscounts = document.querySelectorAll(".cart-discount");
        const url = getUrlBody(button.getAttribute("href"));
        const modId = button.closest("[data-mod-id]").getAttribute("data-mod-id");
        const qty = button.getAttribute("data-qty");
        const oldCount = cartCounts[0].value;
        const newCount = parseInt(oldCount) - parseInt(qty);
        // console.log("[DEBUG]: CartRemove url", url);
        // console.log("[DEBUG]: CartRemove modId", modId);
        // console.log("[DEBUG]: CartRemove oldCount", oldCount);
        // console.log("[DEBUG]: CartRemove qty", qty);
        getHtmlFromUrl(url).then((data) => {
          // console.log("[DEBUG]: getHtmlFromUrl data", data);
          if (newCount > 0) {
            const cartItems = document.querySelectorAll(".cart .addto__item");
            cartItems.forEach((element) => {
              // console.log("[DEBUG]: data-mod-id", element.getAttribute("data-mod-id"));
              if (element.getAttribute("data-mod-id") === modId) {
                // console.log("[DEBUG]: element", element);
                element.remove();
              }
            });
          }
          const productView = document.querySelector(".productView");
          // console.log("[DEBUG]: productView2", productView);
          if (productView.getAttribute("data-mod-id") === modId) {
            productView.querySelector(".productView__cart").classList.remove("has-in-cart");
          }
          CartCountUppdate(cartCounts, newCount);
          CartCountendUppdate(cartCountends, data.querySelector(".cart-countend"));
          CartDiscountUppdate(cartDiscounts, data.querySelector(".cart-discount"));
        });
      }
    });
  });
}

/*
 * Функция обновления счетчика в корзине
 * Используется в функциях: CartRemove, handleAddtoCartUpdate, handleAddtoOrderUpdate
 * Использует функции: CartEmptyUpdate
 */
function CartCountUppdate(elements, count) {
  if (elements.length === 0) return;
  elements.forEach((element) => {
    element.value = count;
    element.innerHTML = count;
  });
  CartEmptyUpdate(count);
}

/*
 * Функция определения добавленных товаров в корзине.
 * Используется в функциях: CartCountUppdate
 */
function CartEmptyUpdate(count) {
  const carts = document.querySelectorAll(".cart");
  if (carts.length === 0) return;
  carts.forEach((element) => {
    count > 0 ? element.classList.remove("is-empty") : element.classList.add("is-empty");
  });
}

/*
 * Функция обновления счетчика кол-ва с окончанием в корзине.
 * Используется в функциях: CartRemove
 */
function CartCountendUppdate(elements, selector) {
  if (elements.length === 0) return;
  elements.forEach((element) => {
    element.value = selector ? selector.value : 0;
    element.innerHTML = selector ? selector.innerHTML : "0 товаров";
  });
}

/**
 * Функция обновления цены в корзине.
 * Используется в функциях: CartRemove, handleAddtoCartUpdate, handleAddtoOrderUpdate
 */
function CartDiscountUppdate(elements, selector) {
  if (elements.length === 0) return;
  elements.forEach((element) => {
    element.value = selector ? selector.value : 0;
    element.innerHTML = selector ? selector.innerHTML : "";
  });
}

/**
 * Оформление быстрого заказа
 * Используется в функциях: handleAddtoOrderOpen, handleCartOrderStart
 */
function Orderfast(doc = document) {
  const container = doc.querySelector(".orderfast__container");
  // console.log("[DEBUG]: container", container);
  if (!container) return;
  // const form = container.querySelector("form");
  const deliverySelect = container.querySelector(".order-delivery__select");
  const deliveryZones = container.querySelectorAll(".order-delivery-zone__selects");
  const deliveryZoneSelects = container.querySelectorAll(".order-delivery-zone__select");
  const deliveryZoneSelected = container.querySelector(".order-delivery-zone__selects:not(.is-hide) .order-delivery-zone__select");
  const deliveryPrices = container.querySelectorAll(".order-delivery__total b");
  const deliveryDescs = container.querySelectorAll(".order-delivery__description");
  const deliveryZoneRules = container.querySelectorAll(".order-delivery__rules");
  const paymentSelects = container.querySelectorAll(".order-payments__selects");
  const paymentSelected = container.querySelector(".order-payments__selects:not(.is-hide) select");
  const paymentDescs = container.querySelectorAll(".order-payments__desc");

  // Запуск функций при загрузке страницы
  handleVisibility(deliveryZones, deliverySelect.value);
  handleVisibility(deliveryDescs, deliverySelect.value);
  handleFormDeliveryZoneId(deliveryZoneSelected);
  handleVisibility(paymentSelects, deliverySelect.value);
  handleVisibility(paymentDescs, paymentSelected.value);
  handleFormPaymentId(paymentSelected);

  // Способы доставки
  deliverySelect.addEventListener("change", (event) => {
    const select = event.target;
    handleVisibility(deliveryZones, select.value);
    handleVisibility(deliveryDescs, select.value);
    handleDeliveryPrice(deliveryPrices, select[select.selectedIndex].getAttribute("data-price"));
    deliveryZoneSelects.forEach((selects) => handleDeliveryZone(selects));
    handleVisibility(paymentSelects, deliverySelect.value);
    const deliveryZoneSelected = document.querySelector(".order-delivery-zone__selects:not(.is-hide) .order-delivery-zone__select");
    console.log("[DEBUG]: deliveryZoneSelected", deliveryZoneSelected);
    handleFormDeliveryZoneId(deliveryZoneSelected);
  });

  // Зоны доставки
  deliveryZoneSelects.forEach((selects) => {
    handleDeliveryZone(selects);
    selects.addEventListener("change", (event) => {
      const select = event.target;
      console.log("[DEBUG]: select", select);
      handleDeliveryPrice(deliveryPrices, select[select.selectedIndex].getAttribute("data-price"));
      handleVisibility(deliveryZoneRules, select.value);
      handleFormDeliveryZoneId(select);
    });
  });

  // Способы оплаты
  paymentSelects.forEach((selects) => {
    selects.addEventListener("change", (event) => {
      handleFormPaymentId(event.target);
      handleVisibility(paymentDescs, event.target.value);
    });
  });

  function handleDeliveryZone(selects) {
    // console.log("[DEBUG]: selects2", selects);
    // console.log("[DEBUG]: selects3", selects.parentElement.classList.contains("is-hide"));
    if (!selects.parentElement.classList.contains("is-hide")) {
      handleDeliveryPrice(deliveryPrices, selects.options[selects.selectedIndex].getAttribute("data-price"));
      handleVisibility(deliveryZoneRules, selects.value);
    } else {
      handleDeliveryPrice(deliveryPrices, deliverySelect.options[selects.selectedIndex].getAttribute("data-price"));
    }
  }

  function handleDeliveryPrice(elements, value) {
    // console.log("[DEBUG]: element", elements);
    // console.log("[DEBUG]: value", value);
    const price = document.createElement("span");
    price.classList.add("num");
    price.append(getMoneyFormat(value));
    elements.forEach((element) => (element.innerHTML = price.outerHTML));
    // console.log("[DEBUG]: price", price);

    // обновления цены доставки
    const cartDeliverys = document.querySelectorAll(".cart-delivery");
    cartDeliverys.forEach((delivery) => {
      delivery.innerHTML = price.outerHTML;
      delivery.value = value;
    });

    // обновления итоговой цены
    const cartTotals = document.querySelectorAll(".cart-total");
    const priceTotal = parseInt(cartTotals[0].value) + parseInt(cartDeliverys[0].value);
    cartTotals.forEach((total) => {
      total.querySelector(".num").innerHTML = getMoneyFormat(priceTotal);
    });
  }

  function handleFormDeliveryZoneId(selected) {
    // console.log("[DEBUG]: selected", selected);
    document.querySelector("[name='form[delivery][zone_id]']").value = selected ? selected.value : "";
  }

  function handleFormPaymentId(selected) {
    document.querySelector("[name='form[payment][id]']").value = selected.value;
  }

  function handleVisibility(elements, value) {
    elements.forEach((element) => {
      if (element.getAttribute("data-id") === value) {
        element.classList.remove("is-hide");
      } else {
        element.classList.add("is-hide");
      }
    });
  }
}

/**
 * Купоны
 * Используется в функциях: handleCartOrderStart
 * Использует функции: getHtmlFromPost
 */
function OrderCoupons() {
  const coupons = document.querySelectorAll(".coupon");
  if (coupons.length === 0) return;
  coupons.forEach((coupon) => {
    const couponInput = coupon.querySelector(".coupon__input");
    const couponReset = coupon.querySelector(".coupon__reset");
    const couponSubmit = coupon.querySelector(".coupon__button");
    handleCouponVisibility(coupon, couponInput.value, "is-reset");

    couponSubmit.addEventListener("click", handleCouponSubmit);
    couponInput.addEventListener("input", handleCouponChange);
    couponReset.addEventListener("click", handleCouponReset);

    function handleCouponSubmit() {
      coupon.classList.add("is-loading");
      const value = couponInput.value;
      const url = "/order/stage/confirm";
      const formData = new FormData();
      const deliveryZoneId = document.querySelector("[name='form[delivery][zone_id]']");
      const deliveryId = document.querySelector("[name='form[delivery][id]']");
      formData.append("ajax_q", "1");
      formData.append("only_body", "1");
      formData.append("form[coupon_code]", value);
      formData.append("form[delivery][zone_id]", deliveryZoneId.value);
      formData.append("form[delivery][id]", deliveryId.value);
      console.log("[DEBUG]: formData", formData);

      getHtmlFromPost(url, formData).then((data) => {
        handleCouponUpdate(data, coupon);
      });
    }

    function handleCouponChange(event) {
      // event.target.setAttribute("value", event.target.value);
      document.querySelectorAll(".coupon__input").forEach((input) => input.setAttribute("value", event.target.value));
      handleCouponVisibility(coupon, event.target.value, "is-reset");
    }

    function handleCouponReset() {
      const cartSum = document.querySelector(".cart-sum");
      const cartTotals = document.querySelectorAll(".cart-total");
      const cartCoupons = document.querySelectorAll(".coupon__input");
      couponInput.value = "";
      handleCouponSubmit();
      cartCoupons.forEach((input) => {
        input.setAttribute("value", "");
        input.classList.remove("is-reset", "is-error", "is-success");
        console.log("[DEBUG]: input", input);
      });
      coupon.classList.remove("is-reset", "is-error", "is-success");
      console.log("[DEBUG]: cartCoupons", cartCoupons);
      console.log("[DEBUG]: coupon", coupon);
      cartTotals.forEach((total) => {
        total.innerHTML = cartSum.innerHTML;
        total.value = cartSum.value;
      });
    }
  });

  function handleCouponUpdate(data, coupon) {
    const cartDiscounts = document.querySelectorAll(".cartTotal__discount");
    const cartCoupons = document.querySelectorAll(".cartTotal__coupons");
    const cartTotals = document.querySelectorAll(".cartTotal__total");
    const discountPrice = data.querySelector(".order-total__price");
    const cartTotalPriceSum = parseInt(discountPrice.getAttribute("data-price"));
    const cartTotalPriceSumDelivery = parseInt(discountPrice.getAttribute("data-price-delivery"));
    console.log("[DEBUG]: cartTotalPriceSumDelivery", cartTotalPriceSumDelivery);
    cartTotals.forEach((total) => {
      total.querySelector(".cart-total").innerHTML = discountPrice.innerHTML;
      total.querySelector(".cart-total").value = cartTotalPriceSum;
      total.querySelector(".cart-discount").innerHTML = discountPrice.innerHTML;
      total.querySelector(".cart-discount").value = cartTotalPriceSum;
    });

    const discount = data.querySelector(".order-discount");
    // const delivery = data.querySelector(".order-delivery");
    const input = coupon.querySelector(".coupon__input");

    console.log("[DEBUG]: discount", discount);
    if (discount) {
      const discountName = discount.querySelector(".order-discount__label");
      const discountValue = discount.querySelector(".order-discount__value");
      cartCoupons.forEach((coupons) => {
        coupons.querySelector(".cartTotal__label").innerHTML = discountName.innerHTML;
        coupons.querySelector(".cartTotal__price").innerHTML = discountValue.innerHTML;
        coupons.style.display = "";
      });
      input.classList.remove("is-error");
      input.classList.add("is-success");
      cartDiscounts?.forEach((discount) => (discount.style.display = "none"));
    } else {
      cartCoupons.forEach((coupons) => (coupons.style.display = "none"));
      cartDiscounts?.forEach((discount) => (discount.style.display = "none"));
      input.classList.remove("is-success");
      handleCouponVisibility(input, input.value, "is-error");
    }
    coupon.classList.remove("is-loading");
  }

  function handleCouponVisibility(coupon, value, className) {
    if (value === "") {
      coupon.classList.remove(className);
    } else {
      coupon.classList.add(className);
    }
  }
}

/**
 * Валидация форм
 * Используется в функциях: Passwords, handleAddtoOrderOpen, handleCartOrderStart
 */
function ValidateRequired(doc = document) {
  const requireds = doc.querySelectorAll("[required]");
  requireds.forEach((item) => {
    item.addEventListener("input", () => {
      ValidateInput(item);
    });
    ValidateInput(item);
  });
}

/**
 * Валидация поля
 * Используется в функциях: ValidateRequired, handleAddtoOrderOpen, handleCartOrderStart
 */
function ValidateInput(item) {
  if (item.value === "") {
    item.classList.add("is-error");
  } else {
    item.classList.remove("is-error");
  }
}

/**
 * Открытие элементов Поиск,
 * Используется в функциях: Search
 * Использует функции: search__reset
 */
function Opener() {
  const search = document.querySelector(".search__icon");
  const reset = document.querySelector(".search__reset");
  search.addEventListener("click", (event) => {
    event.preventDefault();
    const parent = event.currentTarget.parentElement;
    if (parent.classList.contains("is-opened")) {
      reset.click();
    } else {
      setTimeout(() => {
        parent.querySelector(".search__input").focus();
      }, 100);
    }
    parent.classList.toggle("is-opened");
  });

  const catalogButton = document.querySelector(".catalog__button");
  if (catalogButton) {
    catalogButton.addEventListener("click", (event) => {
      event.preventDefault();
      const parentTarget = event.currentTarget.parentElement;
      OverlayOpener(parentTarget, handleCatalogOpened);
    });
  }

  function handleCatalogOpened(event) {
    OverlayCloser(event, ".mainnav__catalog", handleCatalogOpened);
  }

  const mobileMenu = document.querySelector("[data-mobile-menu=open]");
  const mobileContent = document.querySelector("[data-mobile-menu=content]");
  const mobileСlose = document.querySelector("[data-mobile-menu=close]");
  mobileMenu.addEventListener("click", (event) => {
    event.preventDefault();
    event.currentTarget.classList.toggle("is-opened");
    if (mobileContent.classList.contains("is-opened")) {
      mobileContent.setAttribute("hidden", "");
      document.body.classList.remove("is-bodylock");
    } else {
      mobileContent.removeAttribute("hidden");
      document.body.classList.add("is-bodylock");
    }
    mobileContent.classList.toggle("is-opened");
  });
  mobileСlose.addEventListener("click", () => {
    mobileMenu.classList.remove("is-opened");
    mobileContent.classList.remove("is-opened");
    mobileContent.setAttribute("hidden", "");
    document.body.classList.remove("is-bodylock");
  });

  // Открытие каталога с сохранением вложенности
  const catalogOpens = document.querySelectorAll(".catalog__link-icon");
  if (catalogOpens.length > 0) {
    catalogOpens.forEach((catalogOpen) => {
      catalogOpen.addEventListener("click", (event) => {
        event.preventDefault();
        const open = event.currentTarget;
        const parent = open.closest(".is-parent");
        const sub = open.parentElement.nextElementSibling;
        if (parent.classList.contains("is-opened")) {
          $(sub).slideUp(600);
          parent.classList.remove("is-opened");
          open.classList.remove("is-opened");
        } else {
          $(sub).slideDown(600);
          parent.classList.add("is-opened");
          open.classList.add("is-opened");
        }
      });
    });
  }

  const mobileCatalog = document.querySelector(".mobile-menu__link.is-catalog");
  mobileCatalog.addEventListener("click", (event) => {
    event.preventDefault();
    const parent = event.currentTarget.parentElement;
    parent.classList.toggle("is-opened");
  });

  SidebarOpener("#addtoCart", ".cart__open");
}

/**
 * Функция открытия сайдбара
 */
function SidebarOpener(selector, opener) {
  const content = document.querySelector(selector);
  if (!content) return;
  const button = document.querySelector(opener);
  const header = content.querySelector(".sidebar__header");

  button?.addEventListener("click", handleOpen);
  header?.addEventListener("click", handleClosed);
  content.addEventListener("click", handleCloseOutside);

  function handleCloseOutside(event) {
    const target = event.currentTarget;
    const isClickedOutside = event.target === target;
    // console.log("[DEBUG]: event", event);
    // console.log("[DEBUG]: target", target);
    // console.log("[DEBUG]: isClickedOutside", isClickedOutside);
    if (isClickedOutside) {
      handleClosed();
    }
  }

  function handleOpen(event) {
    event.preventDefault();
    console.log("[DEBUG]: event", event);
    if (button.classList.contains("is-active")) {
      handleClosed();
    } else {
      handleOpened();
    }
  }

  function handleOpened() {
    button.classList.add("is-active");
    content.removeAttribute("hidden");
    document.body.classList.add("is-bodylock");
  }

  function handleClosed() {
    button.classList.remove("is-active");
    content.setAttribute("hidden", "");
    document.body.classList.remove("is-bodylock");
  }
}

/**
 * Функция Показать все/Скрыть.
 */
function VisibleItems(selector) {
  const block = document.querySelector(selector);
  if (!block) return false;
  const button = block.querySelector(".products__button");
  if (!button) return false;
  const items = block.querySelectorAll(".product__item");
  const itemsVisible = $(block).find(".product__item:visible");
  // Скрыть/показать кнопку
  button.parentElement.style.display = items.length > itemsVisible.length ? "block" : "none";

  button.addEventListener("click", (event) => {
    event.preventDefault();
    SlotText(event.currentTarget);
    event.currentTarget.classList.toggle("is-active");
    block.classList.toggle("is-active");
    setTimeout(() => {
      scrollTop(button.classList.contains("is-active") ? true : block.offsetTop);
    }, 100);
  });
}

/**
 * Переход к контенту
 */
function scrollTop(offsetTop) {
  if (offsetTop === true) return false;
  window.scrollTo({
    top: offsetTop,
    left: 0,
    behavior: "smooth",
  });
}

/**
 * Слайдер Маленький.
 * Используется в функциях: на всех страницах
 * Использует функции: Swiper
 */
function swiperSmall(selector) {
  const related = document.querySelector(selector);
  // console.log("[DEBUG]: related", related);

  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 8,
    spaceBetween: 0,
    preloadImages: false,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 2,
      },
      480: {
        slidesPerView: 3,
      },
      640: {
        slidesPerView: 4,
      },
      768: {
        slidesPerView: 4,
      },
      1024: {
        slidesPerView: 5,
      },
      1440: {
        slidesPerView: 7,
      },
      1920: {
        slidesPerView: 8,
      },
    },
  });
  // console.log("[DEBUG]: swiper", swiper);
}

/**
 * Слайдер Обычный.
 * Используется в функциях: на всех страницах
 * Использует функции: Swiper
 */
function swiperMedium(selector) {
  const related = document.querySelector(selector);
  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 4,
    spaceBetween: 0,
    preloadImages: false,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 2,
      },
      375: {
        slidesPerView: 2,
      },
      480: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 3,
      },
      1440: {
        slidesPerView: 4,
      },
      1920: {
        slidesPerView: 4,
      },
    },
  });
}

/**
 * Слайдер Большой.
 * Используется в функциях: на всех страницах
 * Использует функции: Swiper
 */
function swiperLarge(selector) {
  const related = document.querySelector(selector);
  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    autoHeight: true,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 3,
    spaceBetween: 16,
    preloadImages: false,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 1.25,
      },
      375: {
        slidesPerView: 1.5,
      },
      480: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      1440: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      1920: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });
}

/**
 * Слайдер Обычный на главной.
 * Используется в функциях: на главной странице
 * Использует функции: Swiper
 */
function swiperMediumIndex(selector) {
  const related = document.querySelector(selector);
  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    autoHeight: true,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 4,
    spaceBetween: 12,
    preloadImages: false,
    initialSlide: 2,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
      dynamicMainBullets: 1,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2.5,
      },
      1024: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

/**
 * Слайдшоу
 * Используется в функциях: на главной
 * Использует функции: Swiper
 */
function swiperShow() {
  const id = "#slideshow";
  const swiperSlider = new Swiper(id + " .slideshow__slider", {
    loop: false,
    preloadImages: false,
    watchSlidesProgress: true,
    watchOverflow: true,
    hashNavigation: false,
    slidesPerView: "1",
    spaceBetween: 16,
    speed: 400,
    autoplay: {
      enabled: false,
      delay: 5000,
    },
    navigation: {
      enabled: true,
      nextEl: id + " .swiper-button-next",
      prevEl: id + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: id + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: false,
    },
    scrollbar: {
      enabled: true,
      el: id + " .swiper-scrollbar",
      snapOnRelease: true,
      draggable: true,
    },
  });
}

/**
 * Слайдер Брендов на главной.
 * Используется в функциях: на главной странице
 * Использует функции: Swiper
 */
function swiperBrands(selector) {
  const related = document.querySelector(selector);
  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: true,
    loopAdditionalSlides: 6,
    autoplay: false,
    autoHeight: false,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    spaceBetween: 50,
    preloadImages: false,
    slidesPerView: "auto",
  });
}

/**
 * Слайдер Обычный на главной.
 * Используется в функциях: на главной странице
 * Использует функции: Swiper
 */
function swiperBanners(selector) {
  const slider = document.querySelector(selector);
  if (!slider) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    autoHeight: true,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 3,
    spaceBetween: 16,
    preloadImages: false,
    initialSlide: 2,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
      dynamicMainBullets: 1,
    },
    scrollbar: {
      enabled: true,
      el: selector + " .swiper-scrollbar",
      snapOnRelease: true,
      draggable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 1.2,
      },
      480: {
        slidesPerView: 1.2,
      },
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 2,
      },
      1440: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      1920: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });
}

/**
 * Слайдер Списком.
 * Используется в функциях: на странице Товаров, Акции, Поиск
 * Использует функции: Swiper
 */
function swiperList(selector) {
  const related = document.querySelector(selector);
  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 0,
    preloadImages: false,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
  });
}

/**
 * Слайдер Отзывов.
 * Используется в функциях: на странице Товар
 * Использует функции: Swiper
 */
function swiperOpinions(selector) {
  const related = document.querySelector(selector);
  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    autoHeight: true,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 3,
    spaceBetween: 16,
    preloadImages: false,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 1,
      },
      375: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      1440: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      1920: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });
}

/**
 * Авторизация без обновления страницы.
 * Используется в функциях: на главной странице
 * Использует функции: getHtmlFromPost
 */
function Autorization() {
  const block = document.getElementById("dialogLogin");
  if (!block) return;
  const form = block.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", handleAuthForm);

  function handleAuthForm(event) {
    event.preventDefault();
    // block.classList.add("is-loading");
    const url = form.action;
    const formData = new FormData(form);
    formData.append("ajax_q", "1");
    // formData.append("only_body", "1");
    // console.log("[DEBUG]: url", url);
    // console.log("[DEBUG]: formData", formData);
    getHtmlFromPost(url, formData).then((data) => {
      // console.log("[DEBUG]: data", data);
      block.innerHTML = data.getElementById("dialogLogin").innerHTML;
      document.querySelector(".addto__link.login").innerHTML = data.querySelector(".addto__link.login").innerHTML;
    });
  }
}

/**
 * Отправка формы без обновления страницы
 */
function Form(id, successMessage, errorMessage) {
  const block = document.getElementById(id);
  if (!block) return;
  const form = block.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", handleForm);

  function handleForm(event) {
    event.preventDefault();
    block.classList.add("is-loading");
    const url = form.action;
    const formData = new FormData(form);
    formData.append("ajax_q", "1");
    formData.append("only_body", "1");
    // console.log("[DEBUG]: url", url);
    // console.log("[DEBUG]: formData", formData);
    getJsonFromPost(url, formData)
      .then((data) => {
        const status = data.status;
        const message = data.message;
        // console.log("[DEBUG]: status", status);
        if (status === "ok") {
          СreateNoty("success", successMessage);
        } else {
          СreateNoty("error", message);
        }
        block.classList.remove("is-loading");
      })
      .catch((error) => {
        console.log("[ERROR]: getJsonFromPost", error);
        СreateNoty("error", errorMessage);
        block.classList.remove("is-loading");
      });
    setTimeout(() => {
      if (block.hasAttribute("open")) {
        block.close();
      }
    }, 3000);
  }
}

/**
 * Загрузка основных функций шаблона на всех страницах.
 */
document.addEventListener("DOMContentLoaded", function () {
  Dialogs();
  Passwords();
  Mainnav(document.querySelector("#header"));
  Mainnav(document.querySelector("#catalog"));
  CartClear();
  CartRemove();
  Addto();
  AddtoCart();
  AddtoMod();
  AddtoOrder();
  AddtoNotify();
  Products();
  Opener();
  Autorization();
  Form("dialogCallback", "Запрос обратного звонка успешно отправлен администрации магазина", "Вы уже отправляли запрос. Пожалуйста ожидайте звонка.");
  Form("dialogNotify", "Вы будете уведомлены о поступлении товара", "Вы уже отправляли запрос. Пожалуйста ожидайте.");
  Form("subscribe", "Спасибо за обращение! Вы подписались на нашу рассылку", "Вы уже отправляли запрос. Пожалуйста ожидайте.");
  // Маска ввода телефона
  $(".form__phone").mask("+7 (999) 999-9999");
});

console.timeEnd("start time");

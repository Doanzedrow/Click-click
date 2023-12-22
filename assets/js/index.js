// --------------------------------------------Khai báo biến toàn cục-----------------------------------
var CLICK = CLICK || {};
// var product = [
//   {
//     id: 1,
//     title: "Dog",
//     image: "./assets/image/dog.png",
//   },
//   {
//     id: 2,
//     title: "Cat",
//     image: "./assets/image/cat.png",
//   },
//   {
//     id: 3,
//     title: "Unicon",
//     image: "./assets/image/unicon.png",
//   },
//   {
//     id: 4,
//     title: "Bee",
//     image: "./assets/image/bee.png",
//   },
// ];
// var charactor = [
//   {
//     id: 1,
//     image: "./assets/image/girl_red.png",
//     imageStroke: "./assets/image/girl_red_stroke.png",
//     imageActive: "./assets/image/girl_red_stroke_active.png",
//   },
//   {
//     id: 2,
//     image: "./assets/image/girl_orange.png",
//     imageStroke: "./assets/image/girl_orange_stroke.png",
//     imageActive: "./assets/image/girl_orange_stroke_active.png",
//   },
//   {
//     id: 3,
//     image: "./assets/image/girl_blue.png",
//     imageStroke: "./assets/image/girl_blue_stroke.png",
//     imageActive: "./assets/image/girl_blue_stroke_active.png",
//   },
//   {
//     id: 4,
//     image: "./assets/image/boy_red.png",
//     imageStroke: "./assets/image/boy_red_stroke.png",
//     imageActive: "./assets/image/boy_red_stroke_active.png",
//   },
// ];
// Product
// Lấy chuỗi JSON từ Local Storage
var storedProducts = localStorage.getItem("productSettings");
// Chuyển đổi chuỗi JSON thành mảng JavaScript
var products = JSON.parse(storedProducts);

// Charactor
// Lấy chuỗi JSON từ Local Storage
var storedCharactors = localStorage.getItem("charactorSettings");
// Chuyển đổi chuỗi JSON thành mảng JavaScript
var charactors = JSON.parse(storedCharactors);

// General
var generalSettings = localStorage.getItem("generalSettings");
// Chuyển đổi chuỗi JSON thành mảng JavaScript
var general = JSON.parse(generalSettings);
var targetQuesId = "";
var countDown = general.countDown;
var countTime;

// --------------------------------------------Thực hiện chức năng-----------------------------------
$(document).ready(function () {
  CLICK.pageActive();
  CLICK.clickSideBar();
  CLICK.getUISetting();
  CLICK.getUI();
  // CLICK.getMusic();
  CLICK.startGame();
  CLICK.initialSetting();
  CLICK.addInputProduct();
  CLICK.addInputCharactor();
  CLICK.setting();
});

CLICK.clickSideBar = () => {
  $("#btn-bar").on("click", function () {
    $(".nav-bar").hide();
    $(".header-nav").css("display", "flex");
  });
  $("section .container").on("click", function () {
    $(".nav-bar").show();
    $(".header-nav").hide();
  });
};

CLICK.startGame = () => {
  $(".btn-start-game").on("click", function () {
    CLICK.countTimePlay();
  });
};
// func đếm thời gian chạy trò chơi
CLICK.getTime = () => {
  console.log(countDown);
  var time = $("#customProgressBar");
  var model = $(".model");
  var maxTime = 100;
  time.css("width", maxTime + "%");
  //cho thời gian chạy là 1s => 100% là 100s
  countTime = setInterval(function () {
    time.css("width", maxTime + "%");
    maxTime--;
    if (maxTime <= 0) {
      model.css("display", "flex");
      $(".login_model").show();
      $(".score").show();
      $(".continue").hide();
      $(".title_model").html("Your points");
      clearInterval(countTime);
      // CLICK.countTimePlay();
    }
  }, countDown);

  var exit_model = $("#icon_exit");
  var pause = $("#pause");
  var isPaused = false;
  //tạm dừng trờ chơi
  pause.on("click", function () {
    model.css("display", "flex");
    exit_model.css("display", "none");
    $(".login_model").hide();
    $(".score").hide();
    $(".continue").show();
    $(".title_model").html("Pause");
    $(".content_model").html(`<img src="assets/image/pause.png" alt="" />`);
    clearInterval(countTime);
    isPaused = true;
  });
  //tiếp tục trò chơi
  $(".continue").on("click", function () {
    model.css("display", "none");
    if (isPaused) {
      countTime = setInterval(function () {
        time.css("width", maxTime + "%");
        maxTime--;
        if (maxTime <= 0) {
          model.css("display", "flex");
          exit_model.css("display", "flex");
          $(".login_model").show();
          $(".score").show();
          $(".continue").hide();
          $(".title_model").html("Your points");
          clearInterval(countTime);
          $(".content_model").html(0);
          // CLICK.countTimePlay();
        }
      }, general.countDown);
      isPaused = false;
    }
  });
  //nhấn nút exit tắt popup đi
  exit_model.on("click", function () {
    model.css("display", "none");
  });
};

CLICK.getRandomQuestion = () => {
  //số con vật xuất hiện
  var numberRandom = CLICK.getRandomIntInclusive(1, 10);
  //là con vật thứ bao nhiêu
  var randomProduct = Math.floor(Math.random() * products.length);
  //thứ tự người hỏi
  var randomPlayer = CLICK.getRandomIntInclusive(0, charactors.length - 1);
  var player = $(".player-model").children().eq(randomPlayer);

  $(".player-model").animate(
    {
      scrollLeft:
        player.offset().left -
        $(".player-model").offset().left +
        $(".player-model").scrollLeft(),
    },
    500
  );

  //Tìm được người hỏi
  var count = 0;
  var point_content = $(".point-content");
  //Hiển thị câu hỏi
  player.children("#talk").show();
  player.children(".player_content").show();
  // hiển thị content hỏi là bao nhiêu con gì
  player
    .children(".player_content")
    .html(`${numberRandom}  ${products[randomProduct].title}`);
  //khi người hỏi thì bg chuyển màu vàng
  player
    .find(".avatar-stroke")
    .attr("src", "./assets/image/" + charactors[randomPlayer].imageActive);

  //id của ques
  targetQuesId = "ques_" + products[randomProduct].id;
  var count = 0;
  //sound
  var wrong = new Howl({
    src: ["./assets/sound/wrong.mp3"],
    volume: 0.5,
  });
  var click = new Howl({
    src: ["./assets/sound/play.mp3"],
    volume: 0.5,
  });
  //Khóa tráng thái click (bởi khi gọi lại hàm này event click luôn chạy)
  $("[id^='ques_']").off("click");
  //khởi tạo trạng thái click lên các con vật
  $("[id^='ques_']").on("click", function () {
    //Kiểm tra xem id của con vật đó
    var clickedId = $(this).attr("id");
    //khi id con vật đó đúng với id mà đã random ra (sai thì hiện wrong đúng thì đếm só)
    if (clickedId !== targetQuesId) {
      wrong.play();
      $(this).children("#wrong").show();
      $("[id^='ques_']").css("pointer-events", "none");
      clearInterval(countTime);
      setTimeout(function () {
        $(".model").css("display", "flex");
        $(".login_model").show();
        $(".score").show();
        $(".continue").hide();
        $(".title_model").html("Your points");
      }, 1000);
    } else {
      click.play();
      count++;
      var model_content = $(".content_model");
      var pre_point = point_content.html();
      var sum_point = parseInt(pre_point, 10) + parseInt(general.pointStep, 10);
      point_content.html(sum_point);
      model_content.html(sum_point);
      $(this).children("#result").show();
      $(this).children(".result-content").show();
      $(this).children(".result-content").html(count);
      //khi số lượng click = với số lượng random thì chuyển qua con khác
      if (count == numberRandom) {
        $(".level").html(
          `Level ${parseInt($(".level").html().split(" ")[1], 10) + 1}`
        );
        countDown = countDown - general.difficulty;
        CLICK.resetCharator(player, randomPlayer);
        CLICK.resetQuestion();
        CLICK.getRandomQuestion();
        clearInterval(countTime);
        CLICK.getTime();
      }
    }
  });
};

//func reset lại product
CLICK.resetQuestion = () => {
  $("[id^='ques_']").children("#result").hide();
  $("[id^='ques_']").children(".result-content").hide();
  $("[id^='ques_']").children(".result-content").html("0");
  $("[id^='ques_']").children("#wrong").hide();
};

//func reset lại charactor
CLICK.resetCharator = (player, randomPlayer) => {
  player
    .find(".avatar-stroke")
    .attr("src", "./assets/image/" + charactors[randomPlayer].imageStroke);
  player.children("#talk").hide();
  player.children(".player_content").hide();
};

//func random từ số min -> max
CLICK.getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//get music
CLICK.getMusic = () => {
  var bgm = new Howl({
    src: ["./assets/sound/BGM.mp3"],
  });
  bgm.play();
  var isMusicOn = true;

  // Sử dụng sự kiện click
  $("#music").on("click", function () {
    // Nếu trạng thái là tắt, chuyển sang bật
    if (!isMusicOn) {
      $(this).attr("src", "./assets/image/icon_music_on.png");
      bgm.play();
    } else {
      // Nếu trạng thái là bật, chuyển sang tắt
      $(this).attr("src", "./assets/image/icon_music_off.png");
      bgm.stop();
    }

    // Đảo ngược trạng thái
    isMusicOn = !isMusicOn;
  });
};

//func khi nào trang active
CLICK.pageActive = () => {
  const PORT = "http://127.0.0.1:5500/";
  var URL = window.location.href;
  if (URL === PORT + "index.html") {
    $(".header-nav").children("li").children("a").eq(0).css("color", "red");
  } else if (URL === PORT + "rules.html") {
    $(".header-nav").children("li").children("a").eq(1).css("color", "red");
  } else if (URL === PORT + "awardlist.html") {
    $(".header-nav").children("li").children("a").eq(2).css("color", "red");
  } else if (URL === PORT + "ratings.html") {
    $(".header-nav").children("li").children("a").eq(3).css("color", "red");
  } else {
    $(".header-nav").children("li").children("a").eq(4).css("color", "red");
  }
};

//func đếm ngược thời gian play
CLICK.countTimePlay = () => {
  var modelPlay = $(".model-play");
  var count_play = 3;
  $(".time_play").css("display", "flex");
  $(".start-game").hide();
  //thời gian chạy 3 giây hiển thị vòng quay
  var countdown = new Howl({
    src: ["./assets/sound/countdown.mp3"],
  });
  countdown.play();
  const timePlay = setInterval(function () {
    var time_content = $(".time-content");
    --count_play;
    time_content.html(count_play);
    if (count_play < 0) {
      clearInterval(timePlay);
      modelPlay.css("display", "inline-block");
      //hiển thị vòng quay ra
      $(".time_play").css("display", "none");

      $(".header-model").css("display", "flex");
      $(".ques-model").css("display", "flex");
      $(".player-model").css("display", "flex");
      countdown.stop();
      CLICK.getRandomQuestion();
      CLICK.getTime();
    }
  }, 1000);
};

//func setting
CLICK.setting = () => {
  $(".fileInput").on("change", function () {
    var fileName = this.files[0].name;
    var targetLabelId = $(this).siblings(".label-product").attr("id");
    $("#" + targetLabelId).html(fileName);
    var fileInputId = $(this).attr("id");
    var imgProductId = "img-product-" + fileInputId.split("-")[1];
    var labelProductId = "label-" + fileInputId;
    CLICK.displayImage(fileInputId, imgProductId, labelProductId);

    //lưu tên file nào localStorage
    var fileInput = $(this)[0];
    var index = fileInput.id.split("-")[1];
    if (fileInput.id.split("-")[0] === "fileInput") {
      var localStorageKey = "productName-" + index;
    } else {
      var localStorageKey = "charactorName-" + index;
    }
    if (fileInput.files.length > 0) {
      var file = fileInput.files[0];
      var fileName = file.name;
      localStorage.setItem(localStorageKey, fileName);
    }
  });

  $(".viewImage").on("click", function () {
    var fileInputId = $(this).data("target");
    CLICK.displayImage(fileInputId);

    var imgProductId = "img-product-" + fileInputId.split("-")[1];
    var imgProductElement = $("#" + imgProductId);

    if (imgProductElement.is(":visible")) {
      // Nếu đã hiển thị, ẩn đi
      imgProductElement.hide();
    } else {
      // Nếu chưa hiển thị, hiển thị lên
      imgProductElement.show();
    }
  });

  //nhấn save là save dữ liệu vào
  $("#save").off();
  $("#save").on("click", function () {
    // Lấy giá trị từ các input
    var countDown = $("input[name='countDown']").val();
    var pointStep = $("input[name='pointStep']").val();
    var difficulty = $("input[name='difficulty']").val();

    // Tạo object chứa dữ liệu
    var general = {
      countDown: countDown,
      pointStep: pointStep,
      difficulty: difficulty,
    };

    // Chuyển object thành chuỗi JSON và lưu vào localStorage
    localStorage.setItem("generalSettings", JSON.stringify(general));

    var products = [];
    //save product
    $(".product-title").each(function (index) {
      var title = $(this).find(".name-product").val();
      // var fileInput = $("#fileInput-" + (index + 1))[0];
      var localStorageKey = "productName-" + (index + 1);
      var selectedFileName = localStorage.getItem(localStorageKey);
      var product = {
        id: index + 1,
        title: title,
        image: selectedFileName,
      };
      products.push(product);
    });
    // Chuyển object thành chuỗi JSON và lưu vào localStorage
    localStorage.setItem("productSettings", JSON.stringify(products));

    var charactors = [];
    $(".label-charactor").each(function (index) {
      var localStorageKey = "charactorName-" + (index + 1);
      var selectedFileName = localStorage.getItem(localStorageKey);

      var charactor = {
        id: index + 1,
        imageStroke:
          selectedFileName.split(".")[0] +
          "_stroke." +
          selectedFileName.split(".")[1],
        imageActive:
          selectedFileName.split(".")[0] +
          "_stroke_active." +
          selectedFileName.split(".")[1],
        image: selectedFileName,
      };
      charactors.push(charactor);
    });
    // Chuyển object thành chuỗi JSON và lưu vào localStorage
    localStorage.setItem("charactorSettings", JSON.stringify(charactors));

    // Hiển thị thông báo hoặc thực hiện các công việc khác nếu cần
    Toastify({
      text: `Settings saved successfully!`,
      duration: 3000,
      close: true,
      gravity: "top",
      positionLeft: false,
      backgroundColor: "green",
    }).showToast();
  });
};

//Thêm input để thêm ảnh product
CLICK.addInputProduct = () => {
  $("#btn-add-product").off();
  $("#btn-add-product").on("click", function () {
    var countTag = $(".upload-image-product .upload-image").length;
    if (countTag > 2) {
      $(".add-product").hide();
    }
    $.template(
      "inputProduct",
      `
        <div class="upload-image" data-id="${countTag + 1}">
          <label for="fileInput-${
            countTag + 1
          }" class="label-product" id="label-product-${countTag + 1}"></label>
          <input type="file" class="fileInput" id="fileInput-${countTag + 1}"
              name="image-product" />
          <label for="fileInput-${countTag + 1}" class="btn-upload-product">
              <img src="assets/image/upload.png" alt="" />
          </label>
          <button class="viewImage" data-target="fileInput-${
            countTag + 1
          }"></button>
        </div>
        
        <div class="img-product" id="img-product-${countTag + 1}"></div>
          `
    );

    $.template(
      "inputProductTitle",
      `
        <div class="product-title" data-id="${countTag + 1}">
          <input type="text" class="name-product" id="name-product-${
            countTag + 1
          }"
              name="title-product" placeholder="Name product" />
          <button class="removeProduct" data-target="${countTag + 1}"></button>
        </div>
      `
    );
    $.tmpl("inputProduct").appendTo(".upload-image-product");
    $.tmpl("inputProductTitle").appendTo(".products");
    CLICK.setting();
    CLICK.addInputProduct();
  });

  $(".removeProduct").off();
  $(".removeProduct").on("click", function () {
    var targetId = $(this).data("target");
    $('[data-id="' + targetId + '"]').remove();
    $(".add-product").show();
    CLICK.setting();
    CLICK.addInputProduct();
  });
};

//Thêm input để thêm ảnh charactor
CLICK.addInputCharactor = () => {
  $("#btn-add-charactor").off();
  $("#btn-add-charactor").on("click", function () {
    var countTag = $(".upload-image-charactor .upload-image").length;
    if (countTag > 2) {
      $(".add-charactor").hide();
    }
    $.template(
      "inputCharactor",
      `
      <div class="upload-image" data-id="charactor-${countTag + 1}">
        <label for="charactor-${
          countTag + 1
        }" class="label-charactor" id="label-charactor-${countTag + 1}"></label>
        <input type="file" class="fileInput" id="charactor-${countTag + 1}" />
        <label for="charactor-${countTag + 1}" class="btn-upload-charactor"><img
                src="assets/image/upload.png" alt="" /></label>
        <button class="removeCharactor" data-target="charactor-${
          countTag + 1
        }"></button>
      </div>
          `
    );
    $.tmpl("inputCharactor").appendTo(".upload-image-charactor");
    CLICK.setting();
    CLICK.addInputCharactor();
  });

  $(".removeCharactor").off();
  $(".removeCharactor").on("click", function () {
    var targetId = $(this).data("target");
    $('[data-id="' + targetId + '"]').remove();
    $(".add-charactor").show();
    CLICK.setting();
    CLICK.addInputCharactor();
  });
};

//func giá trị mặc định khi setting
CLICK.initialSetting = () => {
  $("input[name='countDown']").val(general.countDown);
  $("input[name='pointStep']").val(general.pointStep);
  $("input[name='difficulty']").val(general.difficulty);

  products.forEach(function (item) {
    var productId = item.id;
    $("#name-product-" + productId).attr("value", item.title);
    $("#fileInput-" + productId).attr("value", item.image);
    $("#label-product-" + productId).text(item.image);
    $("#img-product-" + productId).css(
      "background-image",
      "url('assets/image/" + item.image + "')"
    );
  });

  charactors.forEach(function (item) {
    var productId = item.id;
    $("#charactor-" + productId).attr("value", item.image);
    $("#label-charactor-" + productId).text(item.image);
  });
};
// hiển thị ảnh tương ứng
CLICK.displayImage = (fileInputId, imgProduct, labelProduct) => {
  var fileInput = $("#" + fileInputId)[0];
  var imgProductElement = $("#" + imgProduct);
  var labelProductElement = $("#" + labelProduct);

  if (fileInput.files && fileInput.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      imgProductElement.css(
        "background-image",
        "url('" + e.target.result + "')"
      );
      labelProductElement.html(fileInput.files[0].name);
    };

    reader.readAsDataURL(fileInput.files[0]);
  }
};

//Hiển thị UI bằng dữ liệu đã lưu ở localStorage
CLICK.getUISetting = () => {
  var countTag = products.length;
  if (countTag > 3) {
    $(".add-product").hide();
  }
  var countTag = charactors.length;
  if (countTag > 3) {
    $(".add-charactor").hide();
  }
  $.template(
    "inputProduct",
    `
    <div class="upload-image-product">
      {{each products}}
        <div class="upload-image" data-id="{{= id}}">
          <label for="fileInput-{{= id}}" class="label-product" id="label-product-{{= id}}"></label>
          <input type="file" class="fileInput" id="fileInput-{{= id}}"
              name="image-product" />
          <label for="fileInput-{{= id}}" class="btn-upload-product">
              <img src="assets/image/upload.png" alt="" />
          </label>
          <button class="viewImage" data-target="fileInput-{{= id}}"></button>
        </div>
        
        <div class="img-product" id="img-product-{{= id}}"></div>
      {{/each}}
    </div>
        `
  );

  $.template(
    "inputProductTitle",
    `
      <div class="products">
        {{each products}}
          <div class="product-title" data-id="{{= id}}">
            <input type="text" class="name-product" id="name-product-{{= id}}"
                name="title-product" placeholder="Name product" />
            <button class="removeProduct" data-target="{{= id}}"></button>
          </div>
        {{/each}}
      </div>
    `
  );
  $(".upload-image-product").empty();
  $(".products").empty();
  var inputProduct = $.tmpl("inputProduct", {
    products: products,
  }).html();
  var inputProductTitle = $.tmpl("inputProductTitle", {
    products: products,
  }).html();
  $(".upload-image-product").html(inputProduct);
  $(".products").html(inputProductTitle);

  $.template(
    "inputCharactor",
    `
      <div class="upload-image-charactor">
        {{each charactors}}
          <div class="upload-image" data-id="charactor-{{= id}}">
            <label for="charactor-{{= id}}" class="label-charactor" id="label-charactor-{{= id}}"></label>
            <input type="file" class="fileInput" id="charactor-{{= id}}" />
            <label for="charactor-{{= id}}" class="btn-upload-charactor"><img
                    src="assets/image/upload.png" alt="" /></label>
            <button class="removeCharactor" data-target="charactor-{{= id}}"></button>
          </div>
        {{/each}}
      </div>
    `
  );
  $(".upload-image-charactor").empty();
  var inputCharactor = $.tmpl("inputCharactor", {
    charactors: charactors,
  }).html();
  $(".upload-image-charactor").html(inputCharactor);
};

// func get ra UI của product và charactor
CLICK.getUI = () => {
  $.template(
    "product",
    `
    <div class="ques-model">
    {{each products}}
    <div id="ques_{{= id}}">
    <img id="result" src="./assets/image/result.png" alt="" />
    <p id="wrong">Wrong!!!</p>
    <div class="result-content">1</div>
    <img src="assets/image/{{= image}}" alt="" />
    <div class="ques_title">{{= title}}</div>
    </div>
    {{/each}}
    </div>
    `
  );
  $(".ques-model").empty();
  var productHTML = $.tmpl("product", {
    products: products,
  }).html();
  $(".ques-model").html(productHTML);

  $.template(
    "charactor",
    `
    <div class="player-model">
    {{each charactors}}
      <div id="player_{{= id}}">
        <img id="talk" src="./assets/image/messeage_talk.png" alt="" />
        <div class="player_content"></div>
        <div class="image-container">
          <img class="avatar" src="assets/image/{{= image}}" alt="" />
          <img class="avatar-stroke" src="assets/image/{{= imageStroke}}" alt="" />
        </div>
      </div>
      {{/each}}
      </div>
    `
  );
  $(".player-model").empty();
  var charactorHTML = $.tmpl("charactor", {
    charactors: charactors,
  }).html();
  $(".player-model").html(charactorHTML);
};

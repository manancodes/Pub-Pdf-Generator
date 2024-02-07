// Require the 'pug' package
const pug = require("pug");
const fs = require("fs");

// Define a simple Pug template
const CHECKOUT_PDF = `
mixin tableRow(item, index)
    tr 
      td= index + 1
      td= item.sku
      td= item.title
      td.value= item.quantity
      td.value= item.priceString
      td.value= item.totalString
mixin promotionRow(promotion)
    tr
      td
        h4
          | &nbsp;- #{promotion.name}
      td.value
        h4= promotion.amountString
doctype html
html(lang='en')
  head
    meta(charset='UTF-8')
    meta(name='viewport', content='width=device-width, initial-scale=1.0')
    meta(http-equiv='X-UA-Compatible', content='ie=edge')
    style.
      .body {
      padding: 24px;
      }
      .title {
      text-align: center;
      font-size: 22px;
      }
      .info-section {
      display: flex;
      justify-content: space-between;
      }
      .info-section p {
        align-items: center;
        gap: 4px;
        padding: 0;
        margin: 0;
        margin-bottom: 8px;
      }
      .section-title {
      font-size: 18px;
      }
      table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      }
      .main-table td,
      .main-table th {
      text-align: left;
      padding: 8px;
      }
      .main-table th {
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
      }
      .main-table th:first-child {
      border-left: 2px solid #000;
      }
      .main-table th:last-child {
      border-right: 2px solid #000;
      }
      .main-table tbody tr:last-child td {
      border-bottom: 2px solid #000;
      }
      .prices-section {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
      gap: 32px;
      }
      .prices-section h4 {
      margin: 0;
      padding: 0;
      }
      .prices-section td {
        padding-left: 32px;
      }
      .value {
        text-align: right !important;
      }
      ul {
        padding: 0;
        margin: 0;
      }
      .promotionNames {
        list-style-type: "-  ";
        margin-left: 15px;
      }
      .promotionPrices {
        list-style-type: none;
      }
  body.body
    h1.title สรุปรายการสั่งสินค้า
    .info-section
      .customer-info
        h3.section-title ข้อมูลผู้ซื้อ
        p= customerName
        p
          span จัดส่ง : 
          span!= deliveryAddress
        p 
          span วันที่ส่ง : 
          span= deliveryDate
        p 
          span เวลาที่ต้องการ : 
          span= deliveryTime
        p 
          span ผู้ติดต่อ : 
          span= contactPerson
      .seller-info
        h3.section-title ข้อมูลผู้ขาย
        p 
          span หน่วยงาน : 
          span= storeName
        p 
          span คลังสินค้า : 
          span= storeName
        p 
          span รหัสผู้ขาย : 
          span= salesExecutiveName
    table.main-table
      thead
        tr
          th ลำดับที่
          th รหัส
          th สินค้า
          th.value จํานวน
          th.value ราคา
          th.value มูลค่าสินค้ารวม vat (บาท)
      tbody
        each item, index in items
          +tableRow(item, index)
    table.prices-section
      tr
        td
          h4 จำนวนเงินก่อนหักส่วนลด
        td
          h4.value= priceBeforeDiscount
      if promotions.length > 0
        tr
          td
            h4 ส่วนลดโปรโมชั่น :
          td
        each item in promotions
          +promotionRow(item)
      if parseInt(voucherDiscountAmount) > 0
        tr
          td
            h4 ส่วนลดจากการแลกคะแนน
          td
            h4.value= voucherDiscountAmount
      tr
        td
          h4 ส่วนลดทั้งหมด
        td
          h4.value= discountTotal
      tr
        td
          h4 จำนวนเงินหลังหักส่วนลด
        td
          h4.value= priceAfterDiscount
      if parseInt(upchargeTotal) > 0
        tr
          td
            h4 ค่าบริการเพิ่มเติม
          td
            h4.value= upchargeTotal
      tr
        td
          h4 ค่าขนส่ง
        td
          h4.value= deliveryFee
      tr
        td
          h4 จํานวนเงินรวม
        td
          h4.value= totalPrice
`;

var variables = {
  customerName: "Pen undefined",
  deliveryAddress: "1112222, บางบอน, บางบอน, กรุงเทพมหานคร, 10150",
  deliveryDate: "-",
  deliveryTime: "-",
  storeName: "804 - สาขาบางบอน",
  items: [
    {
      sku: "104651",
      quantity: "6.00",
      priceString: "255.00/KG",
      title: "แลคตาซอย นมถั่วเหลือง ยูเอชที รสหวาน 200 มล. แพ็ค 36 กล่อง",
      upchargeTotal: 0,
      total: 1530,
      totalString: "1,530.00",
    },
    {
      sku: "385047",
      quantity: "8.00",
      priceString: "510.00/KG",
      title: "กุ๊ก น้ำมันถั่วเหลือง 1 ลิตร x 12 ขวด ยกลัง",
      upchargeTotal: 0,
      total: 4080,
      totalString: "4,080.00",
    },
    {
      sku: "178465",
      quantity: "3.00",
      priceString: "250.00/EA",
      title:
        "ไบกอน สเปรย์กำจัดยุง มด แมลงสาบ กลิ่นลาเวนเดอร์ 600 มล. x 3 กระป๋อง",
      upchargeTotal: 0,
      total: 750,
      totalString: "750.00",
    },
    {
      sku: "103954",
      quantity: "2.00",
      priceString: "250.00/EA",
      title: "ไบกอน สเปรย์กำจัดยุง มด แมลงสาบ สีเขียว 600 มล. x 3 กระป๋อง",
      upchargeTotal: 0,
      total: 500,
      totalString: "500.00",
    },
  ],
  contactPerson: "ชื่อจริง นามสกุล",
  priceBeforeDiscount: "6,860.00 บาท",
  priceAfterDiscount: "6,559.50 บาท",
  totalPrice: "6,559.50 บาท",
  promotions: [
    {
      id: "100559693",
      name: "Slab_Offer_CP03",
      amount: 153,
      amountString: "153.00 บาท",
    },
    {
      id: "100576745",
      name: "ลด 5 บ./ชิ้น เมื่อซื้อ 5 ขึ้นไป, ลด 9 บ./ชิ้น เมื่อซื้อ 10 ขึ้นไป",
      amount: 15,
      amountString: "15.00 บาท",
    },
    {
      id: "100559860",
      name: "Slab_CP04",
      amount: 73.5,
      amountString: "73.50 บาท",
    },
    {
      id: "100576745",
      name: "ลด 5 บ./ชิ้น เมื่อซื้อ 5 ขึ้นไป, ลด 9 บ./ชิ้น เมื่อซื้อ 10 ขึ้นไป",
      amount: 10,
      amountString: "10.00 บาท",
    },
    {
      id: "100559860",
      name: "Slab_CP04",
      amount: 49,
      amountString: "49.00 บาท",
    },
  ],
  discountTotal: "300.50 บาท",
  upchargeTotal: "0.00 บาท",
  voucherDiscountAmount: "0.00 บาท",
  deliveryFee: "-",
};

// Render the Pug template to HTML
const html = pug.render(CHECKOUT_PDF, variables);

// Write the HTML content to an HTML file
fs.writeFile("output.html", html, function (err) {
  if (err) throw err;
  console.log("HTML file created successfully!");
});

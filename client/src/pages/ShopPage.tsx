import Header from "./Header";
import Footer from "./Footer";
import ShopForm from "./ShopForm";
import "./css/shop.css";
import { useTranslation } from "react-i18next";

import vector1 from "./img/main/Vector.png";
import vector2 from "./img/main/Vector (1).png";
import vector3 from "./img/main/Vector (2).png";
import blend1 from "./img/main/Blend Group 1.png";
import blend2 from "./img/main/Blend Group 2.png";
import macbookPro from "./img/main/Macbook_16_Pro.png";
import macbookAir from "./img/main/Macbook_14_Air.png";
import iphone from "./img/main/Iphone_17_Pro_Max.png";
import airpods from "./img/main/AirPods_3_Pro.png";

export default function ShopPage() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main className="main-s">
        <div className="News">
          <div className="hello_screen">
            <h1 className="title">
              {t("shop.Harmony")}<span className="gradient-text"> {t("shop.perfection")}</span>
            </h1>
            
            <img src={vector1} className="vector1" alt="" />
            <img src={vector2} className="vector2" alt="" />
            <img src={vector3} className="vector3" alt="" />
            <img src={blend1} className="vector4" alt="" />
            <img src={blend2} className="vector5" alt="" />
            
            <p className="subtitle">{t("shop.NewItems")}</p>
            <div className="news">
              <div className="new">
                <img src={macbookPro} alt="" />
              </div>
              <div className="new">
                <img src={macbookAir} alt="" />
              </div>
              <div className="new">
                <img src={iphone} alt="" />
              </div>
              <div className="new">
                <img src={airpods} alt="" />
              </div>
            </div>
          </div>
        </div>
        <ShopForm />
      </main>
      <Footer />
    </>
  );
}
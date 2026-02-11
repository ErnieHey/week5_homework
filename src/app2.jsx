import { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import "./assets/style.css";
import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};
function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});
  const productModalRef = useRef(null);
  const bsModal = useRef(null);

  const checkLogin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
      getProducts();
    } catch (error) {
      console.error(error);
      setIsAuth(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTemplateProduct((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const handleModalImageChange = (index, value) => {
    setTemplateProduct((prevData) => {
      const newImage = [...prevData.imagesUrl];
      newImage[index] = value;

      return {
        ...prevData,
        imagesUrl: newImage,
      };
    });
  };

  const handleAddImage = () => {
    setTemplateProduct((prevData) => {
      const newImage = [...prevData.imagesUrl];
      newImage.push("");
      return {
        ...prevData,
        imagesUrl: newImage,
      }
    });
  };

  const handleRemoveImage = () => {
    setTemplateProduct((prevData) => {
      const newImage = [...prevData.imagesUrl];
      newImage.pop();
      return {
        ...prevData,
        imagesUrl: newImage,
      }
    });
  };
  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log(error.response);
    }
  };
  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file-to-upload", file);

    try {
      const response = await axios.post
        (`${API_BASE}/api/${API_PATH}/admin/upload`,
          formData,);
      setTemplateProduct((pre) => ({
        ...pre,
        imageUrl: response.data.imageUrl,
      }));
    } catch (error) {
      alert("圖片上傳失敗");
    }
  };

  const updateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";

    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    };



    const productData = {
      data: {
        ...templateProduct,
        origin_price: Number(templateProduct.origin_price),
        price: Number(templateProduct.price),
        is_enabled: templateProduct.is_enabled ? 1 : 0,
        imagesUrl: templateProduct.imagesUrl ? templateProduct.imagesUrl.filter((url) => url !== "") : [],
      },
    };

    try {
      const response = await axios[method](url, productData);
      getProducts();
      closeModal();
    } catch (error) {
      alert(error.response?.data.message || "更新失敗");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      getProducts();
      closeModal();
    } catch (error) {
    }
  }
  const handleLogout = () => {
    document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    delete axios.defaults.headers.common["Authorization"];
    setFormData({
      username: "",
      password: "",
    });
    setIsAuth(false);
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired * 1000)}; path=/`;
      axios.defaults.headers.common["Authorization"] = token;

      await checkLogin();
      alert("登入成功！");
    } catch (error) {
      setIsAuth(false);
      alert("登入失敗，請檢查帳號密碼");
    }
  };



  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );


    if (productModalRef.current) {
      bsModal.current = new bootstrap.Modal(productModalRef.current, {
        keyboard: false,
      });
    }

    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      // checkLogin();
    }
  }, []);


  const openModal = (type, product) => {

    setModalType(type);
    setTemplateProduct((pre) => ({
      ...INITIAL_TEMPLATE_DATA,
      ...product,
    }));
    if (bsModal.current) {
      bsModal.current.show();
    }
  };
  const closeModal = () => {
    if (bsModal.current) {
      bsModal.current.hide();
    }
  };

  return (
    <>
      {!isAuth ? (
        <div className="login-screen">
          <div className="container login">
            <h1>請先登入</h1>
            <form className="form-floating" onSubmit={(e) => onSubmit(e)}>
              <div className="form-floating mb-3">
                <input type="email"
                  className="form-control"
                  name="username"
                  placeholder="name@example.com"
                  value={formData.username}
                  onChange={(e) => handleInputChange(e)}
                />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e)}
                />
                <label htmlFor="password">Password</label>
              </div>
              <button type="submit" className="btn btn-success w-100 mt-2">登入</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="container">
          <h2>產品列表</h2>
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-success me-2"
              onClick={handleLogout}
            >
              登出</button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">分類</th>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">編輯</th>
              </tr>
            </thead>
            <tbody>
              {
                products.map(product => (
                  <tr key={product.id}>
                    <td>{product.category}</td>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td className={`${product.is_enabled && "text-success"}`}>{product.is_enabled ? "啟用" : "未啟用"}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button type="button" className="btn btn-sm btn-outline-primary"
                          onClick={() => openModal("edit", product)}
                        >
                          編輯</button>
                        <button type="button" className="btn btn-sm btn-outline-danger"
                          onClick={() => openModal("delete", product)}
                        >
                          刪除</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          <Pagination pagination={pagination}
            onChangePage={getProducts} />
        </div>
      )}

      <div
        ref={productModalRef}
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-hidden="true">
        <ProductModal
          modalType={modalType}
          templateProduct={templateProduct}
          handleAddImage={handleAddImage}
          handleModalImageChange={handleModalImageChange}
          handleModalInputChange={handleModalInputChange}
          handleRemoveImage={handleRemoveImage}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          uploadImage={uploadImage}
          closeModal={closeModal}
        />
      </div>
    </>
  );
};


export default App
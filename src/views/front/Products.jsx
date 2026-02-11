import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`);
        //console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        //console.error(error.response);
      }
    };
    getProducts();
  }, []);

  const readyMore = async (id) => {
    navigate(`/product/${id}`);
//     try {
//       const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
//       console.log(response.data.product);
//       navigate(`/product/${id}`,{
//         state: {
//           productData: response.data.product,
//         }
//       });
//     } catch (error) {
//       console.error(error.response);
//   }
 };
    return (
      <div className="container py-5">
        <div className="row">
          {
            products.map((product) => (

              <div className="col-md-4 mb-3" key={product.id}>
                <div className="card h-100">
                  <img src={product.imageUrl}
                    className="card-img-top"
                    alt={product.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text text-secondary">
                      {product.description}</p>
                    <div className="mt-auto">
                      <p className="card-text mb-1">
                        原價:{product.origin_price}</p>
                      <p className="card-text text-success h5">
                        售價：{product.price}</p>
                      <p className="card-text mb-3">
                        <small className="text-body-secondary">單位：{product.unit}
                        </small>
                      </p>
                      <button type="button" className="btn btn-primary mt-auto"
                        onClick={() => readyMore(product.id)}
                      >
                        查看更多</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
  
  export default Products

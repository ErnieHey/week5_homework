import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  // const location = useLocation();
  // const product = location.state?.productData;

  const { id } = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    const readyMore = async (id) => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`);
        // console.log(response.data.product);
        setProduct(response.data.product);
      } catch (error) {
        // console.error(error.response);
      }
    };
    readyMore(id);
  },
    [id]);

    const addCart = async (id, qty=1) => {
      try {
        const data = {
          product_id: id,
          qty
        }
        const response = await axios.post(
          `${API_BASE}/api/${API_PATH}/cart`, {
            data,
          });

          // console.log(response.data);

        } catch (error) { 
          // console.error(error.response);
        }
      }
        

    

  return (
    <div className="container mt-3">
      {!product ? (<h2>查無此產品</h2>
      ) : (
        <div className="card" style={{ width: '18rem' }}>
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
                onClick={() => addCart(product.id)}
              >
                加入購物車</button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

export default SingleProduct

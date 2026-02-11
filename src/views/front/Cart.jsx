import { useState, useEffect } from "react";
import axios from "axios";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;


function Cart() {
  const [cart, setCart] = useState([]);

  const getCart = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/cart`)
      // console.log(response.data.data);
      setCart(response.data.data);
    } catch (error) {
      // console.log(error.response);
    }
  };
  useEffect(() => {
    getCart();
  }, []);

  // 更新購物車數量
  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = {
        product_id: productId,
        qty: Number(qty),
      }
      await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data });
      getCart();

    } catch (error) {
      // console.log(error.response);
      alert("更新失敗，請確認數量是否正確");
    }
  };



  // 刪除購物車項目
  const deleteCart = async (cartId) => {
    try {
      await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
      );
      getCart();
    } catch (error) {
      // console.log(error.response); console.log(error.response);
    }
  };

  // 清空購物車
  const deleteCartAll = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/carts`;
      await axios.delete(url);
      getCart();
      alert("購物車已清空");
    } catch (error) {
      // console.log(error.response.data);
      alert("清空失敗，購物車可能已經是空的");
    }
  };

  return (
    <div className="container">
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button type="button"
          className="btn btn-outline-danger"
          onClick={() => deleteCartAll()}
          disabled={cart?.carts?.length === 0}
        >
          清空購物車
        </button>
      </div>
      <table className="table align-middle">
        <thead>
          <tr>
            <th scope="col" style={{ width: '80px' }}></th>
            <th scope="col">品名</th>
            <th scope="col" className="text-center" style={{ width: '350px' }}>
              數量</th>
            <th scope="col" className="text-end" style={{ width: '120px' }}>小計</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>
                <button type="button" className="btn btn-outline-danger btn-sm"
                  onClick={() => deleteCart(cartItem.id)}
                >
                  刪除
                </button>
              </td>
              <th scope="row">
                {cartItem.product.title}
              </th>

              <td className="text-center">
                <div className="input-group input-group-sm mx-auto" style={{ maxWidth: '100px' }}>
                  <input
                    type="number"
                    className="form-control text-center"
                    min="1"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    value={cartItem.qty}
                    onChange={(e) =>
                      updateCart(
                        cartItem.id,
                        cartItem.product.id,
                        Number(e.target.value))}
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{
                currency(cartItem.final_total)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end font-weight-bold">{
              currency(cart.final_total || 0)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default Cart;

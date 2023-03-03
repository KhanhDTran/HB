import _ from "lodash";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SpecialtySection() {
  const { specialties } = useSelector((state) => state.fetchData);
  let navigate = useNavigate();

  return (
    <div className=" p-4 pt-20 bg-base-200">
      <div className="flex flex-col gap-20">
        <div className="title text-center text-2xl lg:text-5xl font-bold">
          <h1>Chuyên Khoa Y Tế Phổ Biến</h1>
        </div>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
            {specialties &&
              _.sampleSize(specialties, 4).map((item) => {
                return (
                  <div key={item._id}>
                    <div
                      className="card  bg-base-100 hover:cursor-pointer  hover:bg-base-300 shadow-xl"
                      onClick={() => {
                        navigate(`/specialty/${item._id}/${item.name}`);
                      }}
                    >
                      <div className="avatar flex justify-center p-4">
                        <div className="w-52 rounded-full">
                          <img src={item.image} />
                        </div>
                      </div>
                      <div className="card-body">
                        <h2 className="card-title">{item.name}</h2>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex justify-center pb-4">
          <button
            className="btn btn-outline btn-info"
            onClick={() => {
              navigate(`/all-specialties`);
            }}
          >
            Xem Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  fetchServices,
  fetchAllLabs,
} from "../../../store/features/fetchDataSlice";
import { convertToSelectOptions } from "../../../utils/CommonUtils";
import { customStyles } from "../../../utils/CommonUtils";
import RecordTableServices from "./RecordTableServices";
import TableIndicatedServices from "./TableIndicatedServices";
import { putRequestToast } from "../../../services/commonSv";

export default function LabIndicating(props) {
  const dispatch = useDispatch();

  const { services, labs } = useSelector((state) => state.fetchData);

  const [type, setType] = useState("");
  const [serviceList, setServiceList] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [labOptions, setlabOptions] = useState([]);

  const [selectedList, setSelectedList] = useState([]);
  const [check, setCheck] = useState(false);

  // console.log(props.record);

  // UseEffect
  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchAllLabs({}));
  }, []);

  useEffect(() => {
    if (!_.isEmpty(labs)) setlabOptions(convertToSelectOptions(labs));
  }, [labs]);

  useEffect(() => {
    if (props.record.labServices && props.record.labServices.length > 0) {
      let list = _.map(props.record.labServices, (o) => {
        console.log(o);
        let x = {
          quantity: o.quantity,
          service: o.service,
          _id: o._id,
        };
        return x;
      });
      setSelectedList(list);
    }
  }, [props.record]);

  useEffect(() => {
    if (services)
      setServiceList(
        _.filter(services, (o) => {
          return o.lab;
        })
      );
  }, [services]);

  // function
  function handleOnChangeType(x) {
    setType(x);
    setSelectedLab(null);
    setServiceList(
      _.filter(services, (o) => {
        return o.lab && o.lab.type === x;
      })
    );
    if (x !== "")
      setlabOptions(
        convertToSelectOptions(
          _.filter(labs, (o) => {
            return o.type === x;
          })
        )
      );
    if (x === "") setlabOptions(convertToSelectOptions(labs));
  }

  function handleChangeLab(e) {
    if (e) {
      let service = _.find(services, (o) => o.lab && o.lab._id === e.value);
      setServiceList(
        _.filter(services, (o) => {
          return o.lab && o.lab._id === e.value;
        })
      );
      setType(service.lab.type);
      setSelectedLab(e);
    } else {
      setType("");
      setServiceList([]);
    }
  }

  function handleAddService(service) {
    let list = selectedList;
    let checkService = _.find(list, (o) => {
      return o.service._id === service._id;
    });
    if (checkService) {
      checkService.quantity = +checkService.quantity + 1;
    } else {
      let x = {
        service: {
          _id: service._id,
          name: service.name,
          lab: service.lab,
          unit: service.unit,
          unitPrice: service.unitPrice,
        },
        quantity: 1,
      };
      list.push(x);
    }
    setSelectedList(list);
    setCheck(!check);
  }

  function handleMinusService(e) {
    e.quantity -= 1;
    if (e.quantity === 0) {
      let list = _.filter(selectedList, (o) => {
        return o.service._id !== e.service._id;
      });
      setSelectedList(list);
    }
    setCheck(!check);
  }

  // console.log(selectedList);

  async function handleSaveIndicatedList() {
    let x = _.map(selectedList, (o) => {
      return o.service.lab._id;
    });
    let labs = _.uniq(_.sortBy(x));
    console.log(labs);
    await putRequestToast(
      "/clinic/edit-patient-record",
      {
        _id: props.record._id,
        query: {
          labs,
          labServices: selectedList,
        },
      },
      `??ang l??u danh s??ch ch??? ?????nh...`
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 m-4">
        {/* ------------------------- table indicated */}

        {/* ---------- table indicated services ------------------ */}
        <TableIndicatedServices
          {...{
            selectedList: _.sortBy(selectedList, (o) => {
              return o.service.lab.name;
            }),
            handleMinusService,
          }}
        />
        <div className="w-full flex justify-center p-4 m-4">
          <button
            className="btn btn-info w-40"
            onClick={handleSaveIndicatedList}
          >
            L??u danh s??ch ch??? ?????nh
          </button>
        </div>

        {/* ------------------------ */}

        <div className="p-4 m-4 w-full not-prose flex grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="form-control gap-2 flex">
            <label htmlFor="type" className="pl-2">
              Lo???i Kh??m L??m S??ng
            </label>
            <select
              className="select select-info w-full "
              value={type}
              onChange={(e) => handleOnChangeType(e.target.value)}
            >
              <option value="">Lo???i kh??m l??m s??ng</option>
              <option value="X??t nghi???m m??u">X??t nghi???m m??u</option>
              <option value="X??t nghi???m n?????c ti???u">X??t nghi???m n?????c ti???u</option>
              <option value="Si??u ??m ">Si??u ??m </option>
              <option value="Ch???p X-Quang ">Ch???p X-Quang </option>
              <option value="Ch???p c???ng h?????ng t???">Ch???p c???ng h?????ng t???</option>
            </select>
          </div>

          <div className="w-64 lg:w-96 ">
            <label htmlFor="">Ph??ng kh??m l??m s??ng</label>
            <Select
              isClearable={true}
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              options={labOptions}
              styles={customStyles}
              value={selectedLab}
              placeholder={"Ph??ng kh??m l??m s??ng....."}
              onChange={(e) => {
                handleChangeLab(e);
              }}
            />{" "}
          </div>
        </div>

        {/* ---------- table services ------------------ */}
        <RecordTableServices {...{ type, serviceList, handleAddService }} />
      </div>
    </>
  );
}

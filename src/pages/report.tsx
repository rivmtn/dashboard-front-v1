import {
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ReportRowVo, ReportSumVo } from "app/report/schema";
import Spinner from "components/utils/spinner";
import { getInitEdate, getInitSdate } from "helpers/dates";
import {
  formatDate,
  formatDateToString,
  formatNumber,
  formatStringToDate,
} from "helpers/formats";
import { SortType } from "helpers/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Report() {
  const router = useRouter();
  const [roll, setRoll] = useState<string>("");
  const [data, setData] = useState<ReportRowVo[]>([]);
  const [summary, setSummary] = useState<ReportSumVo>({});
  const [currentPageData, setCurrentPageData] = useState<ReportRowVo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initSdate = getInitSdate();
  const initEdate = getInitEdate();
  const [sdate, setSdate] = useState<string>(initSdate);
  const [edate, setEdate] = useState<string>(initEdate);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const blockSize: number = 10;
  const currentBlock: number = Math.ceil(currentPage / blockSize);
  const totalPages: number = Math.ceil(totalCount / pageSize);
  const startPage: number = (currentBlock - 1) * blockSize + 1;
  const endPage: number = Math.min(startPage + blockSize - 1, totalPages);

  interface SortConfig {
    key: string;
    sort: SortType;
  }
  const initSortConfig: SortConfig = {
    key: "day",
    sort: "desc" as SortType,
  };

  const [sortConfig, setSortConfig] = useState<SortConfig>(initSortConfig);

  const SortDirection = ({ configKey }: { configKey: string }) => {
    let icon: string;
    let nextSort: SortType;
    if (
      sortConfig.key === configKey &&
      sortConfig.sort === ("asc" as SortType)
    ) {
      icon = "▲";
      nextSort = "desc" as SortType;
    } else if (
      sortConfig.key === configKey &&
      sortConfig.sort === ("desc" as SortType)
    ) {
      icon = "▼";
      nextSort = "asc" as SortType;
    } else {
      icon = "▽";
      nextSort = "asc" as SortType;
    }
    return (
      <span
        className="sort"
        onClick={() => {
          setSortConfig({ key: configKey, sort: nextSort });
        }}
      >
        {icon}
      </span>
    );
  };

  const fetchData = async (
    accessToken: string,
    sdate: string,
    edate: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/report?sdate=${sdate}&edate=${edate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      if (!response.ok) {
        alert(`Error: ${response.status}`);
        return;
      }
      const json = await response.json();
      const message = json.message;
      if (
        message === "NO_ACCESS_TOKEN" ||
        message === "EXPIRED_ACCESS_TOKEN" ||
        message === "WRONG_ACCESS_TOKEN"
      ) {
        alert("로그인이 필요합니다.");
        localStorage.removeItem("accessTokenGangsanleeSite");
        router.push("/login");
        return;
      } else if (message === "WRONG_API_KEY") {
        alert("API 키가 잘못되었습니다.\n관리자에게 문의하세요.");
        setData([]);
        setSummary({
          imp: 0,
          click: 0,
          sale: 0,
          order_cnt: 0,
          cancel_cnt: 0,
          revenue: 0,
        });
        setTotalCount(0);
        setCurrentPage(1);
        setSortConfig(initSortConfig);
        setIsLoading(false);
        return;
      } else if (message !== "SUCCESS") {
        alert(`Error: ${message}`);
        return;
      }
      const data = json.data as ReportRowVo[];
      const summary = json.summary as ReportSumVo;
      if (data) {
        setData(data);
        setSummary(summary);
        setTotalCount(data.length);
        setCurrentPage(1);
        setSortConfig(initSortConfig);
        setIsLoading(false);
      }
    } catch (error) {
      alert(`Error: ${error}`);
      return;
    }
  };

  useEffect(() => {
    const sortedData = [...data].sort((a, b) => {
      const aValue = Number(a[sortConfig.key]);
      const bValue = Number(b[sortConfig.key]);
      if (sortConfig.sort === ("asc" as SortType)) {
        return aValue - bValue;
      }
      if (sortConfig.sort === ("desc" as SortType)) {
        return bValue - aValue;
      }
    });
    setData(sortedData);
  }, [sortConfig]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = data.slice(startIndex, endIndex);
    setCurrentPageData(currentPageData);
  }, [currentPage, pageSize, data]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessTokenGangsanleeSite");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    const roll = localStorage.getItem("rollGangsanleeSite");
    setRoll(roll);
    fetchData(accessToken, initSdate, initEdate);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className={"report"}>
      <div className={"header"}>
        {roll === "admin" && (
          <>
            <Button
              onClick={() => {
                router.push("/member");
              }}
            >
              사용자 관리
            </Button>
            <Button
              onClick={() => {
                router.push("/setting");
              }}
            >
              설정
            </Button>
          </>
        )}
        <Button
          onClick={() => {
            localStorage.removeItem("accessTokenGangsanleeSite");
            localStorage.removeItem("rollGangsanleeSite");
            router.push("/login");
          }}
        >
          로그아웃
        </Button>
      </div>
      <div className={"title"}>
        <h1>리포트</h1>
      </div>
      <div className={"search-box"}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            disableFuture={true}
            value={formatStringToDate(sdate)}
            inputFormat={"yyyy-MM-dd"}
            mask={"____-__-__"}
            onChange={(newDate: Date) => {
              const newSdate = formatDateToString(newDate);
              if (newSdate <= edate) {
                setSdate(newSdate);
              } else {
                setSdate(newSdate);
                setEdate(newSdate);
              }
            }}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <span>~</span>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            disableFuture={true}
            value={formatStringToDate(edate)}
            inputFormat={"yyyy-MM-dd"}
            mask={"____-__-__"}
            onChange={(newDate: Date) => {
              const newEdate = formatDateToString(newDate);
              if (newEdate >= sdate) {
                setEdate(newEdate);
              } else {
                setSdate(newEdate);
                setEdate(newEdate);
              }
            }}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button
          className={"search-button"}
          onClick={() => {
            const accessToken = localStorage.getItem(
              "accessTokenGangsanleeSite"
            );
            setIsLoading(true);
            fetchData(accessToken, sdate, edate);
          }}
        >
          검색
        </Button>
      </div>
      <div className={"table"}>
        <div>
          <span>총 {data.length}건</span>
          <span>
            <Select
              className={"page-size"}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <MenuItem value={25}>{25}</MenuItem>
              <MenuItem value={50}>{50}</MenuItem>
              <MenuItem value={100}>{100}</MenuItem>
            </Select>
            개씩 보기
          </span>
        </div>
        <Table>
          <TableHead>
            <tr>
              <th scope="col">
                <span>날짜</span>
                <SortDirection configKey={"day"} />
              </th>
              <th scope="col">
                <span>노출</span>
                <SortDirection configKey={"imp"} />
              </th>
              <th scope="col">
                <span>클릭</span>
                <SortDirection configKey={"click"} />
              </th>
              <th scope="col">
                <span>매출</span>
                <SortDirection configKey={"sale"} />
              </th>
              <th scope="col">
                <span>주문건수</span>
                <SortDirection configKey={"order_cnt"} />
              </th>
              <th scope="col">
                <span>취소건수</span>
                <SortDirection configKey={"cancel_cnt"} />
              </th>
              <th scope="col">
                <span>수익</span>
                <SortDirection configKey={"revenue"} />
              </th>
            </tr>
          </TableHead>
          <TableBody>
            {currentPageData.map((row: ReportRowVo, index: number) => (
              <tr key={index}>
                <td>{formatDate(row.day)}</td>
                <td>{formatNumber(row.imp)}</td>
                <td>{formatNumber(row.click)}</td>
                <td>{formatNumber(row.sale)}</td>
                <td>{formatNumber(row.order_cnt)}</td>
                <td>{formatNumber(row.cancel_cnt)}</td>
                <td>{formatNumber(row.revenue)}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </TableBody>
          <TableFooter>
            <tr>
              <td style={{ fontWeight: "bolder" }}>합계</td>
              <td>{formatNumber(summary.imp)}</td>
              <td>{formatNumber(summary.click)}</td>
              <td>{formatNumber(summary.sale)}</td>
              <td>{formatNumber(summary.order_cnt)}</td>
              <td>{formatNumber(summary.cancel_cnt)}</td>
              <td>{formatNumber(summary.revenue)}</td>
            </tr>
          </TableFooter>
        </Table>
        <div className={"pagination"}>
          {currentPage > 1 && (
            <Button onClick={() => setCurrentPage(1)}>처음</Button>
          )}
          {currentBlock > 1 && (
            <Button onClick={() => setCurrentPage(startPage - 1)}>이전</Button>
          )}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => startPage + index
          ).map((pageNumber: number, index: number) => (
            <Button
              className={currentPage === pageNumber ? "active" : null}
              key={index}
              onClick={() => setCurrentPage(pageNumber)}
              disabled={currentPage === pageNumber}
            >
              {pageNumber}
            </Button>
          ))}
          {currentBlock < Math.ceil(totalPages / blockSize) && (
            <Button onClick={() => setCurrentPage(endPage + 1)}>다음</Button>
          )}
          {currentPage < totalPages && (
            <Button onClick={() => setCurrentPage(totalPages)}>마지막</Button>
          )}
        </div>
      </div>
    </section>
  );
}

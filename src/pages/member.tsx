import { Button, Table, TableBody, TableHead } from "@mui/material";
import { MemberVo } from "app/member/schema";
import { MemberCreateModal } from "components/member/member-create-modal";
import { MemberUpdateModal } from "components/member/member-update-modal";
import Spinner from "components/utils/spinner";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Member() {
  const router = useRouter();
  const [data, setData] = useState<MemberVo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [member, setMember] = useState<MemberVo>({});
  const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  const [createOpen, setCreateOpen] = useState<boolean>(false);

  const fetchData = async (accessToken: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/member`,
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
      } else if (message === "ACCESS_DENIED") {
        alert("접근 권한이 없습니다.");
        localStorage.removeItem("accessTokenGangsanleeSite");
        router.push("/login");
        return;
      } else if (message !== "SUCCESS") {
        alert(`Error: ${message}`);
        return;
      }
      const data = json.data as MemberVo[];
      if (data) {
        setData(data);
        setIsLoading(false);
      }
    } catch (error) {
      alert(`Error: ${error}`);
      return;
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessTokenGangsanleeSite");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    fetchData(accessToken);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className={"member"}>
      <div className={"header"}>
        <Button
          onClick={() => {
            router.push("/report");
          }}
        >
          리포트
        </Button>
        <Button
          onClick={() => {
            router.push("/setting");
          }}
        >
          설정
        </Button>
        <Button
          onClick={() => {
            localStorage.removeItem("accessTokenGangsanleeSite");
            router.push("/login");
          }}
        >
          로그아웃
        </Button>
      </div>
      <div className={"title"}>
        <h1>사용자 관리</h1>
      </div>
      <div className={"create"}>
        <Button onClick={() => setCreateOpen(true)}>신규 생성</Button>
      </div>

      <div className={"table"}>
        <Table>
          <colgroup>
            <col width="5%" />
            <col width="10%" />
            <col width="20%" />
            <col width="35%" />
            <col width="20%" />
            <col width="5%" />
            <col width="5%" />
          </colgroup>
          <TableHead>
            <tr>
              <th scope="col">
                <span>번호</span>
              </th>
              <th scope="col">
                <span>권한</span>
              </th>
              <th scope="col">
                <span>아이디</span>
              </th>
              <th scope="col">
                <span>API KEY</span>
              </th>
              <th scope="col">
                <span>생성일</span>
              </th>
              <th scope="col" />
              <th scope="col" />
            </tr>
          </TableHead>
          <TableBody>
            {data.map((row: MemberVo, index: number) => (
              <>
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.roll}</td>
                  <td>{row.authId}</td>
                  <td>{row.apiKey}</td>
                  <td>{row.createdAt}</td>
                  <td>
                    <Button
                      onClick={() => {
                        setMember(row);
                        setUpdateOpen(true);
                      }}
                    >
                      수정
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={async () => {
                        const confirm = window.confirm("삭제 하시겠습니까?");
                        if (!confirm) {
                          return;
                        }
                        try {
                          const accessToken =
                            localStorage.getItem("accessTokenGangsanleeSite");
                          const response = await fetch(
                            `${process.env.NEXT_PUBLIC_BACK_URL}/member?id=${row.memberId}`,
                            {
                              method: "DELETE",
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
                          } else if (message === "ACCESS_DENIED") {
                            alert("접근 권한이 없습니다.");
                            localStorage.removeItem("accessTokenGangsanleeSite");
                            router.push("/login");
                            return;
                          }
                          alert("삭제되었습니다.");
                          router.reload();
                        } catch (error) {
                          alert(`Error: ${error}`);
                          return;
                        }
                      }}
                    >
                      삭제
                    </Button>
                  </td>
                </tr>
              </>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      <MemberUpdateModal
        member={member}
        open={updateOpen}
        setOpen={setUpdateOpen}
      />
      <MemberCreateModal open={createOpen} setOpen={setCreateOpen} />
    </section>
  );
}

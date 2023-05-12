import * as React from "react";
import { useState } from "react";
import { alpha, styled } from "@mui/material/styles";
import {
  AppBar,
  Box,
  InputBase,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { setURLSearchParams } from "../../utils";
import { useRouter } from "next/router";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function TopBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      router.push(setURLSearchParams("/search-results", `q=${searchTerm}`));
    }
  };

  const onSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <div className="halfSize">
            <IconButton
              href="/"
              rel="noopener noreferrer"
              style={{ backgroundColor: "transparent" }}
            >
              <Box
                component="img"
                alt="Magnolia"
                src="https://www.magnolia-cms.com/.resources/corpweb2021/webresources/img/magnolia-logo.svg"
              />
              <Typography
                variant="h4"
                component="div"
                style={{
                  paddingTop: 0,
                  paddingBottom: 10,
                }}
              >
                Recommends
              </Typography>
            </IconButton>
          </div>
          <div className="halfSize">
            {!router.asPath.includes("newRecommendation") && (
              <div className="halfSize">
                <Button
                  style={{ backgroundColor: "white", marginRight: 20 }}
                  size="medium"
                  href={"/newRecommendation"}
                >
                  I Recommend
                </Button>
              </div>
            )}
            <div className="halfSize">
              <Search sx={{ textAlign: "right" }}>
                <SearchIconWrapper style={{ width: "10%" }}>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  onKeyDown={onKeyDown}
                  onChange={onSearchTermChange}
                  value={searchTerm}
                  style={{ width: "90%" }}
                />
              </Search>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

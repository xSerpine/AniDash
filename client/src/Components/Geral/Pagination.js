import React, { Fragment } from 'react'
import { PaginationArrows } from '../Styled Components/content'
import { Space } from '../Styled Components/navbar'
import { Titulo, SubTitulo } from '../Styled Components/text'

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage, Title, MainTitle, type, style }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <Fragment>
            {type === "right" ?
                <PaginationArrows style={style}>
                    { Title && <SubTitulo>{Title}</SubTitulo> }
                    { MainTitle && <Titulo style={{textAlign: "center"}}>{MainTitle}</Titulo> }
                    <Space />
                    { currentPage - 1 !== 0 && totalPosts > 0 ? <i className="fas fa-angle-left" onClick={() => paginate(currentPage - 1)}></i> : <i className="fas fa-angle-left" style={{visibility: "hidden"}}></i> }
                    &nbsp;
                    { currentPage + 1 !== pageNumbers.length + 1 && totalPosts > 0 ? <i className="fas fa-angle-right" onClick={() => paginate(currentPage + 1)}></i> : <i className="fas fa-angle-right" style={{visibility: "hidden"}}></i> }
                </PaginationArrows>
                :
                <PaginationArrows style={style}>
                    { currentPage - 1 !== 0 && totalPosts > 0 ? <i className="fas fa-angle-left" onClick={() => paginate(currentPage - 1)}></i> : <i className="fas fa-angle-left" style={{visibility: "hidden"}}></i> }
                    <Space />
                    { Title && <SubTitulo style={{textAlign: "center"}}>{Title}</SubTitulo> }
                    { MainTitle && <Titulo style={{textAlign: "center"}}>{MainTitle}</Titulo> }
                    <Space />
                    { currentPage + 1 !== pageNumbers.length + 1 && totalPosts > 0 ? <i className="fas fa-angle-right" onClick={() => paginate(currentPage + 1)}></i> : <i className="fas fa-angle-right" style={{visibility: "hidden"}}></i> }
                </PaginationArrows>
            }
        </Fragment>
    )
}

export default Pagination;